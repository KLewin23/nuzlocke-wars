'use server';

import { eq } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import type { PlayerList } from '@/type/actions';
import { eitherOr, leftOf } from '@/util/either';
import { type QueryState, badRequest } from '@/util/query';
import { RoundStatus, TeamRole, db, draft, round } from '@/db';
import { createDraftToTeamInternal } from '@/func/draft/createDraftToTeamInternal';
import { createDraftToPlayersInternal } from '@/func/draft/createDraftToPlayerInternal';

interface CreateDraftPayload {
	name: string;
	roundLength?: number;
	initialPlayerCoins?: number;
	teamIds: Array<number>;
	players: PlayerList;
}

const createDraft = async ({
	name,
	initialPlayerCoins,
	roundLength,
	teamIds,
	players,
}: CreateDraftPayload): Promise<QueryState> =>
	adminSession(async () => {
		if (players.length === 0) return leftOf(badRequest('Received 0 players when creating draft, minimum: 1'));
		const nonCaptainPlayers = players.filter(p => p.teamRole === TeamRole.player);
		const captains = players.filter(p => p.teamRole === TeamRole.captain);
		if (teamIds.length === 0) return leftOf(badRequest('Received 0 teams for draft: minimum: 1'));
		if (captains.length === 0) return leftOf(badRequest('Received 0 players with `captain` role, minimum: 1'));
		if (nonCaptainPlayers.length === 0)
			return leftOf(badRequest('Received 0 players with `player` role, minimum: 1'));
		const firstTargetPlayer = nonCaptainPlayers[Math.floor(Math.random() * nonCaptainPlayers.length)];

		const transactionResponse = await eitherOr(
			db.transaction(async tx => {
				const createdDrafts = await tx
					.insert(draft)
					.values({
						name,
						roundLength,
						initialPlayerCoins,
					})
					.returning({ id: draft.id });
				const createdDraft = createdDrafts.at(0);
				if (createdDraft === undefined) return tx.rollback();
				const roundResponse = await tx
					.insert(round)
					.values({
						draftId: createdDraft.id,
						targetUserId: firstTargetPlayer.userId,
						roundStatus: RoundStatus.pre_bidding,
					})
					.returning({ id: round.id });
				const createdRound = roundResponse.at(0);
				if (createdRound === undefined) return tx.rollback();
				await tx.update(draft).set({ currentRoundId: createdRound.id }).where(eq(draft.id, createdDraft.id));
				return createdDraft;
			}),
			err => buildCRUDError('create', 'draft', err),
		);

		if (transactionResponse._type === 'left') return transactionResponse;

		const attatchTeamsResponse = await createDraftToTeamInternal(transactionResponse.value.id, teamIds);
		if (attatchTeamsResponse._type === 'left') return attatchTeamsResponse;

		return createDraftToPlayersInternal(transactionResponse.value.id, players);
	});

export default createDraft;
