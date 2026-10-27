import logger from '@/logger';
import type { auth } from '@/auth/auth';
import { type Either } from '@/util/either';
import { bid, db, teamsToDrafts } from '@/db';
import buildCRUDError from '@/error/crudError';
import { and, eq, inArray, sum } from 'drizzle-orm';
import type { GetCurrentCaptainSpend } from '@/type/queries';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

import isInDraftQuery from '../isInDraftQuery';

const getCaptainSpend = async (
	session: typeof auth.$Infer.Session,
	draftId: number,
): Promise<Either<QueryFailureState, Success<GetCurrentCaptainSpend>>> => {
	logger.info('getCaptainSpend');
	const baseQuery = db
		.select({
			teamName: teamsToDrafts.teamName,
			coinsSpent: sum(bid.amount).mapWith(Number),
		})
		.from(teamsToDrafts)
		.innerJoin(bid, and(eq(teamsToDrafts.teamName, bid.teamName), eq(teamsToDrafts.draftId, bid.draftId)))
		.groupBy(teamsToDrafts.teamName);

	return successOr(
		session.user.role === 'user' ?
			baseQuery.where(
				and(inArray(teamsToDrafts.draftId, isInDraftQuery(session)), eq(teamsToDrafts.draftId, draftId)),
			)
		:	baseQuery.where(eq(teamsToDrafts.draftId, draftId)),
		err => buildCRUDError('read', 'drafts', err),
		false,
	);
};
export default getCaptainSpend;
