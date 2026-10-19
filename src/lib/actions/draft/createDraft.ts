'use server';

import { eq } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import type { PlayerList } from '@/type/actions';
import { eitherOr, leftOf, rightOf } from '@/util/either';
import { type QueryState, badRequest } from '@/util/query';
import { RoundStatus, TeamRole, db, draft, round, team } from '@/db';
import { createDraftToTeamInternal } from '@/func/draft/createDraftToTeamInternal';
import { createDraftToPlayersInternal } from '@/func/draft/createDraftToPlayerInternal';

interface CreateDraftPayload {
	name: string;
	roundLength?: number;
	initialPlayerCoins?: number;
	teams: Array<{ id: number } | { name: string }>;
	players: PlayerList;
}

const createDraft = async ({
	name,
	initialPlayerCoins,
	roundLength,
	teams,
	players,
}: CreateDraftPayload): Promise<QueryState> =>
	adminSession(
		async () => {
			if (players.length === 0) return leftOf(badRequest('Received 0 players when creating draft, minimum: 1'));
			const nonCaptainPlayers = players.filter(p => p.teamRole === TeamRole.player);
			const captains = players.filter(p => p.teamRole === TeamRole.captain);
			if (teams.length === 0) return leftOf(badRequest('Received 0 teams for draft: minimum: 1'));
			if (captains.length === 0) return leftOf(badRequest('Received 0 players with `captain` role, minimum: 1'));
			if (nonCaptainPlayers.length === 0)
				return leftOf(badRequest('Received 0 players with `player` role, minimum: 1'));
			if (teams.length > players.length)
				return leftOf(
					badRequest(
						`Received less teams than players, each team must have at least one player (The Captian)`,
					),
				);
			const firstTargetPlayer = nonCaptainPlayers[Math.floor(Math.random() * nonCaptainPlayers.length)];

			const groupedTeams = teams.reduce<{ existing: Array<number>; new: Array<string> }>(
				(acc, cur) => {
					if ('id' in cur) return { ...acc, existing: [...acc.existing, cur.id] };
					return { ...acc, new: [...acc.new, cur.name] };
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

			if (transactionResponse._type === 'left') return transactionResponse;

			const newTeams =
				groupedTeams.new.length !== 0 ?
					await eitherOr(
						db
							.insert(team)
							.values(
								groupedTeams.new.map(t => ({
									displayName: t,
								})),
							)
							.returning({ id: team.id }),
						err => buildCRUDError('create', 'team', err),
					)
				:	rightOf([]);

			if (newTeams._type === 'left') return newTeams;

			const attatchTeamsResponse = await createDraftToTeamInternal(transactionResponse.value.id, [
				...groupedTeams.existing,
				...newTeams.value.map(nt => nt.id),
			]);
			if (attatchTeamsResponse._type === 'left') return attatchTeamsResponse;

			return createDraftToPlayersInternal(transactionResponse.value.id, players);
		},
		{
			draft: ['create', 'update'],
		},
	);

export { createDraft, type CreateDraftPayload };
