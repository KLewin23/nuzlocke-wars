'use server';

import { Role } from '@/db';
import { auth } from '@/auth';
import generator from 'generate-password';
import adminSession from '@/func/adminSession';
import { leftOf } from '@/util/either';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

interface CreateUserPayload {
	username: string;
	role: Role;
	password?: string;
	imageUrl?: string;
}

const createUser = async ({ username, role, password, imageUrl }: CreateUserPayload): Promise<QueryState> =>
	adminSession(async session => {
		if (role === Role.super && session.user.role !== Role.super) return leftOf({ type: 'Forbidden' as const });

		const passwd =
			password ??
			generator.generate({
				length: 12,
				numbers: true,
				symbols: true,
				strict: true,
			});
		return successOr(
			auth.api.signUpEmail({
				body: {
					email: `${username}@placeholder.com`,
					name: username,
					username,
					image: imageUrl,
					password: passwd,
					role,
				},
			}),
			err => buildCRUDError('create', 'user', err),
		);
	});
export default createUser;
