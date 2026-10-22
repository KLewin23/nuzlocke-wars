import { auth } from '@/auth/auth';
import { type Either } from '@/util/either';
import buildCRUDError from '@/error/crudError';
import { and, eq, inArray, sum } from 'drizzle-orm';
import { GetCurrentCaptainSpend } from '@/type/queries';
import { TeamRole, bid, db, draft, round, usersToDrafts } from '@/db';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

const noAuthCaptainSpend = async (
	session: typeof auth.$Infer.Session,
	draftId: number,
): Promise<Either<QueryFailureState, Success<GetCurrentCaptainSpend>>> => {
	const baseQuery = db
		.select({
			captainId: usersToDrafts.userId,
			coinsSpent: sum(bid.amount).mapWith(Number),
		})
		.from(round)
		.innerJoin(usersToDrafts, eq(bid.userId, usersToDrafts.userId))
		.leftJoin(bid, eq(bid.roundId, round.id))
		.groupBy(usersToDrafts.userId);

	return successOr(
		session.user.role === 'user' ?
			baseQuery.where(
				and(
					eq(round.draftId, draftId),
					eq(usersToDrafts.draftId, draftId),
					eq(usersToDrafts.teamRole, TeamRole.captain),
					inArray(
						draft.id,
						db
							.select({ data: usersToDrafts.draftId })
							.from(usersToDrafts)
							.where(eq(usersToDrafts.userId, session.user.id)),
					),
				),
			)
		:	baseQuery.where(
				and(
					eq(round.draftId, draftId),
					eq(usersToDrafts.draftId, draftId),
					eq(usersToDrafts.teamRole, TeamRole.captain),
				),
			),
		err => buildCRUDError('read', 'drafts', err),
		false,
	);
};
export default noAuthCaptainSpend;
