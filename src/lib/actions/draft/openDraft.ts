'use server';

import logger from '@/logger';
import type { QueryResult } from 'pg';
import { and, eq, ne } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { eitherOr, rightOf } from '@/util/either';
import buildActionError from '@/error/actionError';
import { rejected, successOr } from '@/util/query';
import type { QueryState, Rejected, Success } from '@/util/query';
import { DraftStatus, RoundStatus, TeamRole, db, draft, round, usersToDrafts } from '@/db';

const openDraft = async (draftId: number): Promise<QueryState> =>
	adminSession<Success<QueryResult<never>> | Rejected>(async () => {
		const draftResponse = await eitherOr(
			db
				.select({ status: draft.status, currentRoundId: draft.currentRoundId })
				.from(draft)
				.where(eq(draft.id, draftId)),
			err => buildCRUDError('read', 'draft', err),
		);

		if (draftResponse._type === 'left') return draftResponse;
		if (draftResponse.value.length > 1) logger.warn('Multiple drafts found while opening draft.');
		const draftRecord = draftResponse.value.at(0);
		if (draftRecord === undefined) return rightOf(rejected('Draft was not found.'));

		const participants = await eitherOr(
			db.select().from(usersToDrafts).where(eq(usersToDrafts.draftId, draftId)),
			err => buildCRUDError('read', 'user to draft mapping', err),
		);

		if (participants._type === 'left') return participants;
		if (participants.value.length === 0)
			return rightOf(
				rejected(
					'Draft did not meet minimum participant requirment. Requires a minmum of: 1 player, 1 captain',
				),
			);
		const captains = participants.value.filter(p => p.teamRole === TeamRole.captain);
		if (captains.length) return rightOf(rejected('Draft missing minimum capatins. Minmum of: 1 captain'));
		const players = participants.value.filter(p => p.teamRole === TeamRole.player);
		const targetPlayer = players.at(0);
		if (targetPlayer === undefined) return rightOf(rejected('Draft missing minimum players. Minmum of: 1 player'));

		const cleanUnexpectedRounds = await eitherOr(
			db
				.delete(round)
				.where(
					draftRecord.currentRoundId === null ?
						eq(round.draftId, draftId)
					:	and(eq(round.draftId, draftId), ne(round.id, draftRecord.currentRoundId)),
				)
				.returning({ id: round.id }),
			err => buildCRUDError('delete', 'invalid rounds', err),
		);
		if (cleanUnexpectedRounds._type === 'left') return cleanUnexpectedRounds;
		if (cleanUnexpectedRounds.value.length !== 0)
			logger.warn('Found unexpected disconnected rounds before draft start.');

		const roundId =
			draftRecord.currentRoundId === null ?
				await eitherOr(
					db.transaction(async tx => {
						const roundResponse = await tx
							.insert(round)
							.values({
								draftId: draftId,
								targetUserId: targetPlayer.userId,
								roundStatus: RoundStatus.pre_bidding,
							})
							.returning({ id: round.id });
						const createdRound = roundResponse.at(0);
						if (createdRound === undefined) return tx.rollback();
						await tx.update(draft).set({ currentRoundId: createdRound.id }).where(eq(draft.id, draftId));
						return createdRound;
					}),
					err => buildActionError('create and attach round', 'creating and attaching round', err),
				)
			:	rightOf({ id: draftRecord.currentRoundId });

		if (roundId._type === 'left') return roundId;

		return successOr(
			db
				.update(draft)
				.set({
					status: DraftStatus.open,
					currentRoundId: roundId.value.id,
				})
				.where(eq(draft.id, draftId)),
			err => buildCRUDError('update', 'draft', err),
		);
	});

export default openDraft;
