import logger from '@/logger';
import type { auth } from '@/auth/auth';
import buildCRUDError from '@/error/crudError';
import { and, eq, inArray } from 'drizzle-orm';
import type { GetCurrentRound } from '@/type/queries';
import { eitherOr, leftOf, rightOf } from '@/util/either';
import { bid, db, draft, round, teamsToDrafts, user } from '@/db';
import { type QueryStateWithNonFailure, type Success, notFound } from '@/util/query';

import isInDraftQuery from '../isInDraftQuery';

const getCurrentRound = async (
	session: typeof auth.$Infer.Session,
	draftId: number,
): Promise<QueryStateWithNonFailure<Success<GetCurrentRound>>> => {
	const baseQuery = db
		.select({
			roundId: round.id,
			biddingStartTime: round.biddingStartTime,
			roundStatus: round.roundStatus,
			roundLength: draft.roundLength,
			targetPlayer: {
				id: user.id,
				username: user.username,
				image: user.image,
			},
		})
		.from(draft)
		.innerJoin(round, eq(draft.currentRoundId, round.id))
		.leftJoin(user, eq(user.id, round.targetUserId));

	const roundResponse = await eitherOr(
		session.user.role === 'user' ?
			baseQuery.where(and(inArray(draft.id, isInDraftQuery(session)), eq(draft.id, draftId)))
		:	baseQuery.where(eq(draft.id, draftId)),
		err => buildCRUDError('read', 'current round', err),
	);

	if (roundResponse._type === 'left') return roundResponse;
	if (roundResponse.value.length > 1)
		logger.warn(`Multiple round retrieved when expecing to return 1 in getCurrentRound`);
	const currentRound = roundResponse.value.at(0);
	if (!currentRound) return leftOf(notFound(`Current round not found for draft: ${draftId}`));

	const bidResponse = await eitherOr(
		db
			.select({ teamName: bid.teamName, amount: bid.amount, captainId: teamsToDrafts.captainId, id: bid.id })
			.from(bid)
			.innerJoin(
				teamsToDrafts,
				and(eq(teamsToDrafts.teamName, bid.teamName), eq(teamsToDrafts.draftId, bid.draftId)),
			)
			.where(eq(bid.roundId, currentRound.roundId)),
		err => buildCRUDError('read', 'bids', err),
	);
	if (bidResponse._type === 'left') return bidResponse;

	return rightOf({
		type: 'Success' as const,
		data: { ...currentRound, bids: bidResponse.value },
	});
};

export default getCurrentRound;
