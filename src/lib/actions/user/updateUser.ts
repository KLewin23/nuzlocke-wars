'use server';

import { Role, db, user } from '@/db';
import { leftOf } from '@/util/either';
import { and, eq, or } from 'drizzle-orm';
import adminSession from '@/func/adminSession';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

interface UpdateUserPayload {
	role?: Role;
	imageUrl?: string;
}

const updateUser = async (targetUserId: string, { role, imageUrl }: UpdateUserPayload): Promise<QueryState> =>
	adminSession(async session => {
		if (session.user.role === Role.basic) return leftOf({ type: 'Forbidden' as const });

		const queryBase = db.update(user).set({
			...(role ? { role } : {}),
			image: imageUrl,
		});
		const query =
			session.user.role === Role.admin ?
				queryBase.where(
					and(eq(user.id, targetUserId), or(eq(user.role, Role.basic), eq(user.role, Role.admin))),
				)
			:	queryBase.where(and(eq(user.id, targetUserId)));

		return successOr(query, err => buildCRUDError('update', 'user', err));
	});
export default updateUser;
