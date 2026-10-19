'use server';

import type { Either } from '@/util/either';
import withSession from '@/func/withSession';
import buildCRUDError from '@/error/crudError';
import { db, draft, usersToDrafts } from '@/db';
import { count, eq, inArray } from 'drizzle-orm';
import type { DraftResponseList } from '@/type/actions';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

const getDrafts = async (): Promise<Either<QueryFailureState, Success<DraftResponseList>>> =>
	withSession(async session => {
		const baseQuery = db
			.select({
				id: draft.id,
				name: draft.name,
				status: draft.status,
				playerCount: count(usersToDrafts.userId),
			})
			.from(draft)
			.leftJoin(usersToDrafts, eq(draft.id, usersToDrafts.draftId))
			.groupBy(draft.id);

		return successOr(
			session.user.role === 'user' ?
				baseQuery.where(
					inArray(
						draft.id,
						db
							.select({ data: usersToDrafts.draftId })
							.from(usersToDrafts)
							.where(eq(usersToDrafts.userId, session.user.id)),
					),
				)
			:	baseQuery,
			err => buildCRUDError('read', 'drafts', err),
		);
	});
export default getDrafts;
