'use server';

import type { Either } from '@/util/either';
import withSession from '@/func/withSession';
import buildCRUDError from '@/error/crudError';
import { count, eq, inArray } from 'drizzle-orm';
import { db, draft, playersToDrafts } from '@/db';
import type { DraftResponseList } from '@/type/actions';
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
							.where(eq(playersToDrafts.userId, session.user.id)),
					),
				)
			:	baseQuery,
			err => buildCRUDError('read', 'drafts', err),
			false
		);
	});
export default getDrafts;
