'use server';

import { Role, db, user } from '@/db';
import { and, eq, or } from 'drizzle-orm';
import adminSession from '@/func/adminSession';
import { eitherOr, leftOf } from '@/util/either';
import buildCRUDError from '@/error/crudError';

const deleteUser = async (userId: string) =>
	adminSession(async session => {
		if (session?.user.role === Role.basic) return leftOf('User forbidden from deleting user.');

		const query =
			session.user.role === Role.admin ?
				db
					.delete(user)
					.where(and(eq(user.id, userId), or(eq(user.role, Role.basic), eq(user.role, Role.admin))))
			:	db.delete(user).where(and(eq(user.id, userId)));

		return eitherOr(query, err => buildCRUDError('delete', 'user', err));
	});

export default deleteUser;
