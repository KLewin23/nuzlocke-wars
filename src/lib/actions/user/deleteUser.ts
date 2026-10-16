'use server';

import { Role, db, user } from '@/db';
import { eitherOr } from '@/util/either';
import { and, eq, or } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';

const deleteUser = async (userId: string) =>
	adminSession(async session => {
		const query =
			session.user.role === Role.admin ?
				db
					.delete(user)
					.where(and(eq(user.id, userId), or(eq(user.role, Role.basic), eq(user.role, Role.admin))))
			:	db.delete(user).where(and(eq(user.id, userId)));

		return eitherOr(query, err => buildCRUDError('delete', 'user', err));
	});

export default deleteUser;
