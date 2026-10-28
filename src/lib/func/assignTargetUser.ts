import buildCRUDError from '@/error/crudError';
import { and, eq, lt, sql } from 'drizzle-orm';
import { eitherOr, leftOf } from '@/util/either';
import { type QueryStateWithNonFailure, type Success, rejected, successOr } from '@/util/query';
import { DraftStatus, RoundStatus, db, draft, playersToDrafts, round, teamsToDrafts } from '@/db';

interface HighestBid {
	userId: string;
	teamName: string;
}

const assignTargetUser = async (
	draftId: number,
	highestBid?: HighestBid,
): Promise<QueryStateWithNonFailure<Success<undefined>>> => {
	if (highestBid)
		return await successOr(
			db
				.update(playersToDrafts)
				.set({ teamName: highestBid.teamName })
				.where(and(eq(playersToDrafts.userId, highestBid.userId), eq(playersToDrafts.draftId, draftId))),
			err => buildCRUDError('update', 'players to team assignments', err),
		);
	const randomTargetTeamResponse = await eitherOr(
		db
			.select({
				targetUserId: round.targetUserId,
				teamName: teamsToDrafts.teamName,
			})
			.from(draft)
			.innerJoin(round, eq(round.id, draft.currentRoundId))
			.innerJoin(teamsToDrafts, eq(teamsToDrafts.draftId, draft.id))
			.innerJoin(
				playersToDrafts,
				and(eq(playersToDrafts.draftId, draft.id), eq(playersToDrafts.teamName, teamsToDrafts.teamName)),
			)
			.where(and(eq(round.roundStatus, RoundStatus.bidding), eq(draft.status, DraftStatus.active)))
			.having(lt(sql`count(playersToDrafts.userId) + 1`, draft.maxPlayersPerTeam)),
		err => buildCRUDError('read', 'random team', err),
	);

	if (randomTargetTeamResponse._type === 'left') return randomTargetTeamResponse;
	const randomTargetTeam = randomTargetTeamResponse.value.at(0);
	if (!randomTargetTeam) return leftOf(rejected('No team bid for player, and all teams are full.'));

	return successOr(
		db
			.update(playersToDrafts)
			.set({ teamName: randomTargetTeam.teamName })
			.where(
				and(eq(playersToDrafts.userId, randomTargetTeam.targetUserId), eq(playersToDrafts.draftId, draftId)),
			),
		err => buildCRUDError('update', 'players to team assignments', err),
	);
};

export default assignTargetUser;
