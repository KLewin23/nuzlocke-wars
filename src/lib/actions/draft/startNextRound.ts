'use server';
import { eitherOr } from '@/util/either';
import { publishEvent } from '@/util/ably';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import buildActionError from '@/error/actionError';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { type QueryState, successOr } from '@/util/query';
import buildAblyPublishError from '@/error/ablyPublishError';
import { DraftStatus, RoundStatus, db, draft, playersToDrafts, round, user } from '@/db';

// Tldr. Create the next round, set the target player, sets the drafts current round to the new one.
const startNextRound = async (draftId: number): Promise<QueryState> =>
	adminSession(
		async () => {
			const nextTarget = await eitherOr(
				db
					.select({ userId: user.id })
					.from(playersToDrafts)
					.innerJoin(user, eq(user.id, playersToDrafts.userId))
					.leftJoin(round, and(eq(user.id, round.targetUserId), eq(round.draftId, draftId)))
					.where(and(eq(playersToDrafts.draftId, draftId), isNull(round.id)))
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
					tx.update(draft).set({ currentRoundId: rnd.id }).where(eq(draft.id, draftId));
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
