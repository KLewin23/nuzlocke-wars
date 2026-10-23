import logger from '@/logger';
import type { auth } from '@/auth/auth';
import { eq, inArray } from 'drizzle-orm';
import { db, draft, round, user } from '@/db';
import buildCRUDError from '@/error/crudError';
import type { GetCurrentRound } from '@/type/queries';
import { eitherOr, leftOf, rightOf } from '@/util/either';
import { type QueryStateWithNonFailure, type Success, notFound } from '@/util/query';

import isInDraftQuery from '../isInDraftQuery';

const getCurrentRound = async (
	session: typeof auth.$Infer.Session,
	draftId: number,
): Promise<QueryStateWithNonFailure<Success<GetCurrentRound>>> => {
	const baseQuery = db
		.select({
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
		session.user.role === 'user' ? baseQuery.where(inArray(draft.id, isInDraftQuery(session))) : baseQuery,
		err => buildCRUDError('read', 'current round', err),
	);

	if (roundResponse._type === 'left') return roundResponse;
	if (roundResponse.value.length > 1)
		logger.warn(`Multiple round retrieved when expecing to return 1 in getCurrentRound`);
	const currentRound = roundResponse.value.at(0);
	if (!currentRound) return leftOf(notFound(`Current round not found for draft: ${draftId}`));

	return rightOf({
		type: 'Success' as const,
		data: currentRound,
	});
};

export default getCurrentRound;
