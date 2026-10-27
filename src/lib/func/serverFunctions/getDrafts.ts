import { type Either } from '@/util/either';
import withSession from '@/func/withSession';
import buildCRUDError from '@/error/crudError';
import { count, eq, inArray, or } from 'drizzle-orm';
import type { DraftResponseList } from '@/type/actions';
import { db, draft, playersToDrafts, teamsToDrafts } from '@/db';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

const getDrafts = async (): Promise<Either<QueryFailureState, Success<DraftResponseList>>> =>
	withSession(async session => {
		const baseQuery = db
			.select({
				id: draft.id,
				name: draft.name,
				status: draft.status,
				playerCount: count(playersToDrafts.userId),
			})
			.from(draft)
			.leftJoin(playersToDrafts, eq(draft.id, playersToDrafts.draftId))
			.groupBy(draft.id);

		return successOr(
			session.user.role === 'user' ?
				baseQuery.where(
					inArray(
						draft.id,
						db
							.select({ data: playersToDrafts.draftId })
							.from(playersToDrafts)
							.fullJoin(teamsToDrafts, eq(playersToDrafts.draftId, teamsToDrafts.draftId))
							.where(
								or(
									eq(playersToDrafts.userId, session.user.id),
									eq(teamsToDrafts.captainId, session.user.id),
								),
							),
					),
				)
			:	baseQuery,
			err => buildCRUDError('read', 'drafts', err),
			false,
		);
	});

export default getDrafts;
