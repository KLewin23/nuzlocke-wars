'use server';

import { count, eq } from 'drizzle-orm';
import { db, session, user } from '@/db';
import type { Either } from '@/util/either';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import type { UserResponseList } from '@/type/actions';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

const getUsers = async (): Promise<Either<QueryFailureState, Success<UserResponseList>>> =>
	adminSession(
		async () =>
			successOr(
				db
					.select({
						id: user.id,
						username: user.username,
						role: user.role,
						createdAt: user.createdAt,
						userSessionsCount: count(session.id),
					})
					.from(user)
					.leftJoin(session, eq(user.id, session.userId))
					.groupBy(user.id),
				err => buildCRUDError('read', 'drafts', err),
				false,
			),
		{
			user: ['get'],
		},
	);
export default getUsers;
