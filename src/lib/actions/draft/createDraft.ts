'use server';

import { eq } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { badRequest, successOr } from '@/util/query';
import { RoundStatus, db, draft, round, team } from '@/db';
import { Either, eitherOr, leftOf, rightOf } from '@/util/either';
import type { BaseTeamData, PlayerList, Team } from '@/type/actions';
import { createDraftToTeamInternal } from '@/func/createDraftToTeamInternal';
import { createDraftToPlayersInternal } from '@/func/createDraftToPlayerInternal';
import type { QueryFailureState, QueryStateWithNonFailure, Success } from '@/util/query';

interface CreateDraftPayload {
	name: string;
	roundLength?: number;
	initialPlayerCoins?: number;
	teams: Array<Team>;
	players: PlayerList;
	maxPlayersPerTeam: number;
}

const createDraft = async ({
	name,
	initialPlayerCoins,
	roundLength,
	teams,
	players,
	maxPlayersPerTeam,
}: CreateDraftPayload): Promise<QueryStateWithNonFailure<Success>> =>
	adminSession<Success>(
		async () => {
			if (players.length === 0) return leftOf(badRequest('Received 0 players when creating draft, minimum: 1'));
			if (teams.length === 0) return leftOf(badRequest('Received 0 teams for draft: minimum: 1'));
			if (players.length === 0) return leftOf(badRequest('Received 0 players with `player` role, minimum: 1'));
			if (teams.length > players.length)
				return leftOf(
					badRequest(
						`Received less teams than players, each team must have at least one player (The Captian)`,
					),
				);
			const firstTargetPlayer = players[Math.floor(Math.random() * players.length)];

			const groupedTeams = teams.reduce<{ existing: Array<BaseTeamData>; new: Array<BaseTeamData> }>(
				(acc, cur) => {
					if (cur.isNew) return { ...acc, new: [...acc.new, cur] };
					return { ...acc, existing: [...acc.existing, cur] };
				},
				{ existing: [], new: [] },
			);

			const transactionResponse = await eitherOr(
				db.transaction(async tx => {
					const createdDrafts = await tx
						.insert(draft)
						.values({
							name,
							roundLength,
							initialPlayerCoins,
							maxPlayersPerTeam,
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
					await tx
						.update(draft)
						.set({ currentRoundId: createdRound.id })
						.where(eq(draft.id, createdDraft.id));
					return createdDraft;
				}),
				err => buildCRUDError('create', 'draft', err),
			);
			
			const teamsResponse = await insertNewTeams(groupedTeams.new)
			if (teamsResponse._type === 'left') return teamsResponse;

			if (transactionResponse._type === 'left') return transactionResponse;

			const attatchTeamsResponse = await createDraftToTeamInternal(transactionResponse.value.id, [
				...groupedTeams.existing,
				...groupedTeams.new,
			]);
			if (attatchTeamsResponse._type === 'left') return attatchTeamsResponse;

			return createDraftToPlayersInternal(transactionResponse.value.id, players);
		},
		{
			draft: ['create', 'update'],
		},
	);

export { createDraft, type CreateDraftPayload };

const insertNewTeams = async (
	teams: Array<{ name: string }>,
): Promise<Either<QueryFailureState, Success<undefined>>> => {
	if (teams.length === 0) return rightOf({ type: 'Success' as const, data: undefined });
	return successOr(
		db.insert(team).values(
			teams.map(t => ({
				name: t.name,
			})),
		),
		err => buildCRUDError('create', 'team', err),
	);
};
