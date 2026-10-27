'use server';

import * as z from 'zod';
import { auth } from '@/auth/auth';
import generator from 'generate-password';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import buildAuthError from '@/error/buildAuthError';
import type { CreateUserPayload } from '@/type/actions';
import { type QueryState, type Success, successOr } from '@/util/query';

const createUsers = async (users: Array<CreateUserPayload>): Promise<QueryState> =>
	adminSession<Success<Array<{ password: string }>>>(
		async () => {
			const passwordSchema = z.string().min(8);
			const getPassword = (user: CreateUserPayload) => {
				const parsedPass = z.safeParse(passwordSchema, user.password);
				return parsedPass.success ?
						parsedPass.data
					:	generator.generate({
							length: 12,
							numbers: true,
							symbols: true,
							strict: true,
						});
			};
			return successOr(
				Promise.all(
					users.map(user => {
						const { username, imageUrl, role } = user;
						const password = getPassword(user);
						return auth.api
							.createUser({
								body: {
									email: `${username}@placeholder.com`,
									name: username,
									password,
									role,
									data: {
										image: imageUrl,
										username,
									},
								},
							})
							.then(() => ({ password }));
					}),
				),
				err => buildAuthError(err, buildCRUDError('create', 'users', err)),
				false
			);
		},
		{
			user: ['create'],
		},
	);

export { createUsers, type CreateUserPayload };
