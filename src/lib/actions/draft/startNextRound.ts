'use server';
import { publishEvent } from '@/util/ably';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { eitherOr, rightOf } from '@/util/either';
import buildActionError from '@/error/actionError';
import assignTargetUser from '@/func/assignTargetUser';
import { type QueryState, successOr } from '@/util/query';
import buildAblyPublishError from '@/error/ablyPublishError';
import { and, asc, desc, eq, isNotNull, isNull, ne, sql } from 'drizzle-orm';
import { DraftStatus, RoundStatus, bid, db, draft, playersToDrafts, round, user } from '@/db';

// Tldr. Create the next round, set the target player, sets the drafts current round to the new one.
const startNextRound = async (draftId: number): Promise<QueryState> =>
	adminSession(
		async () => {
			const highestBidResponse = await eitherOr(
				db
					.select({ userId: round.targetUserId, teamName: bid.teamName, bidId: bid.id })
					.from(draft)
					.innerJoin(round, eq(round.id, draft.currentRoundId))
					.innerJoin(bid, and(eq(draft.id, bid.draftId), eq(bid.roundId, round.id)))
					.where(eq(draft.id, draftId))
					.orderBy(desc(bid.amount), asc(bid.id), desc(sql`RANDOM()`)) // highest or first
					.limit(1),
				err => buildCRUDError('read', 'highest bid', err),
			);

			if (highestBidResponse._type === 'left') return highestBidResponse;
			const highestBid = highestBidResponse.value.at(0);

			const userAssignment = await assignTargetUser(draftId, highestBid);
			if (userAssignment._type === 'left') return userAssignment;

			const setBidAsWinner =
				highestBid ?
					await successOr(db.update(bid).set({ isWinner: true }).where(eq(bid.id, highestBid?.bidId)), err =>
						buildCRUDError('update', 'highest bid', err),
					)
				:	rightOf({});

			if (setBidAsWinner._type === 'left') return setBidAsWinner;

			const nextTarget = await eitherOr(
				db
					.select({ userId: user.id })
					.from(playersToDrafts)
					.innerJoin(user, eq(user.id, playersToDrafts.userId))
					.leftJoin(round, and(ne(user.id, round.targetUserId), eq(round.draftId, draftId))) //NOTE THIS SEEMS WRONG should be not equal to user
					.where(
						and(
							eq(playersToDrafts.draftId, draftId),
							isNotNull(round.id),
							isNull(playersToDrafts.teamName),
						),
					)
					.orderBy(sql`RANDOM()`)
					.limit(1),
				err => buildCRUDError('read', 'next target player', err),
			);
			if (nextTarget._type === 'left') return nextTarget;
			const target = nextTarget.value.at(0);
			if (target === undefined) {
				const endDraftResponse = await eitherOr(
					db.update(draft).set({ status: DraftStatus.complete }).where(eq(draft.id, draftId)),
					err => buildActionError('ending draft', 'end draft', err),
				);
				if (endDraftResponse._type === 'left') return endDraftResponse;
				return successOr(publishEvent(draftId, 'DraftEnded'), err => buildAblyPublishError('DraftEnded', err));
			}

			const startRoundResponse = await eitherOr(
				db.transaction(async tx => {
					const roundResponse = await tx
						.insert(round)
						.values({
							draftId,
							targetUserId: target.userId,
							roundStatus: RoundStatus.pre_bidding,
						})
						.returning({ id: round.id });
					const rnd = roundResponse.at(0);
					if (rnd === undefined) return tx.rollback();

					await tx
						.update(draft)
						.set({ currentRoundId: rnd.id })
						.where(eq(draft.id, draftId))
						.returning({ draftId: draft.id });
				}),
				err => buildActionError('creating role and updating draft', 'create and select next round', err),
			);

			return startRoundResponse._type === 'left' ?
					startRoundResponse
				:	successOr(publishEvent(draftId, 'NextRoundStarted'), err =>
						buildAblyPublishError('NextRoundStarted', err),
					);
		},
		{
			draft: ['update'],
		},
	);
export default startNextRound;
