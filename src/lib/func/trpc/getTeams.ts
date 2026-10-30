import logger from '@/logger';
import type { auth } from '@/auth/auth';
import buildCRUDError from '@/error/crudError';
import type { GetTeams } from '@/type/queries';
import { and, eq, isNotNull, sum } from 'drizzle-orm';
import { type QueryFailureState, type Success } from '@/util/query';
import { bid, db, playersToDrafts, teamsToDrafts, user } from '@/db';
import { type Either, eitherOr, leftOf, rightOf } from '@/util/either';

import isInDraftQuery from '../isInDraftQuery';

// `isNotNull` doesn't type correctly BUG: https://github.com/drizzle-team/drizzle-orm/issues/2956
const getTeams = async (
	session: typeof auth.$Infer.Session,
	draftId: number,
): Promise<Either<QueryFailureState, Success<GetTeams>>> => {
	const userInDraft =
		session.user.role === 'admin' ?
			'admin'
		:	await eitherOr(isInDraftQuery(session), err => buildCRUDError('read', 'players to drafts', err));

	if (userInDraft !== 'admin' && userInDraft._type === 'left') return userInDraft;
	if (userInDraft !== 'admin' && userInDraft.value.length === 0)
		return leftOf({
			type: 'Unauthorized' as const,
		});

	const captainsQuery = await eitherOr(
		db
			.select({
				captainId: teamsToDrafts.captainId,
				teamName: teamsToDrafts.teamName,
				username: user.username,
				image: user.image,
				coinsSpent: sum(bid.amount).mapWith(Number),
			})
			.from(teamsToDrafts)
			.innerJoin(user, eq(teamsToDrafts.captainId, user.id))
			.leftJoin(bid, and(eq(teamsToDrafts.teamName, bid.teamName), eq(teamsToDrafts.draftId, bid.draftId), eq(bid.isWinner, true)))
			.where(eq(teamsToDrafts.draftId, draftId))
			.groupBy(teamsToDrafts.teamName, user.username, teamsToDrafts.captainId, user.image),
		err => buildCRUDError('read', 'teamsToDrafts', err),
	);

	if (captainsQuery._type === 'left') return captainsQuery;

	const playersQuery = await eitherOr(
		db
			.select({
				userId: playersToDrafts.userId,
				username: user.username,
				teamName: playersToDrafts.teamName,
				image: user.image,
			})
			.from(playersToDrafts)
			.innerJoin(user, eq(playersToDrafts.userId, user.id))
			.where(and(isNotNull(playersToDrafts.teamName), eq(playersToDrafts.draftId, draftId))),
		err => buildCRUDError('read', 'playersToDrafts', err),
	);

	if (playersQuery._type === 'left') return playersQuery;

	const teams = captainsQuery.value.reduce<GetTeams>((acc, d) => {
		if (d.teamName in acc) logger.info(`Team defined twice for one draft in team_to_draft.`);

		return {
			...acc,
			[d.teamName]: {
				captain: {
					id: d.captainId,
					username: d.username,
					image: d.image,
				},
				players: [],
				coinsSpent: d.coinsSpent ?? 0,
			},
		};
	}, {});

	const teamsWithPlayers = playersQuery.value.reduce<GetTeams>((acc, cur) => {
		if (!cur.teamName) return acc;
		if (!(cur.teamName in acc)) {
			logger.info(`Player has team name which does not exist in teams_to_drafts for draft: ${draftId}.`);
			return acc;
		}
		return {
			...acc,
			[cur.teamName]: {
				captain: acc[cur.teamName].captain,
				players: [
					...acc[cur.teamName].players,
					{
						id: cur.userId,
						username: cur.username,
						image: cur.image,
					},
				],
				coinsSpent: acc[cur.teamName].coinsSpent,
			},
		};
	}, teams);

	return rightOf({
		type: 'Success' as const,
		data: teamsWithPlayers,
	});
};
export default getTeams;
