'use server';

import * as z from 'zod';
import { auth } from '@/auth/auth';
import generator from 'generate-password';
import type { CreatedUser } from '@/type/queries';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import buildAuthError from '@/error/buildAuthError';
import type { CreateUserPayload } from '@/type/actions';
import { type QueryStateWithNonFailure, type Success, successOr } from '@/util/query';
import { headers } from 'next/headers';

const createUsers = async (
	users: Array<CreateUserPayload>,
): Promise<QueryStateWithNonFailure<Success<Array<CreatedUser>>>> =>
	adminSession<Success<Array<CreatedUser>>>(
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
					users.map(async user => {
						const { username, imageUrl, role } = user;
						const password = getPassword(user);
						return auth.api
							.createUser({
								headers: await headers(),
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
							.then(() => ({ password, username }));
					}),
				),
				err => buildAuthError(err, buildCRUDError('create', 'users', err)),
				false,
			);
		},
		{
			user: ['create'],
		},
	);

export { createUsers, type CreateUserPayload };
