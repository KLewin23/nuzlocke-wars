'use server';

import { Role, db, user } from '@/db';
import { and, eq, or } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { type QueryState, successOr } from '@/util/query';

interface UpdateUserPayload {
	role?: Role;
	imageUrl?: string;
}

const updateUser = async (targetUserId: string, { role, imageUrl }: UpdateUserPayload): Promise<QueryState> =>
	adminSession(
		async session => {
			const queryBase = db.update(user).set({
				...(role ? { role } : {}),
				image: imageUrl,
			});
			const query =
				session.user.role === Role.admin ?
					queryBase.where(
						and(eq(user.id, targetUserId), or(eq(user.role, Role.user), eq(user.role, Role.admin))),
					)
				:	queryBase.where(and(eq(user.id, targetUserId)));

			return successOr(query, err => buildCRUDError('update', 'user', err));
		},
		{
			user: ['update'],
		},
	);
export default updateUser;
