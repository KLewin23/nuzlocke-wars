'use server';

import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import { successOr } from '@/util/query';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';

const deleteUser = async (userId: string) =>
	adminSession(
		async () =>
			successOr(auth.api.removeUser({ headers: await headers(), body: { userId } }), err =>
				buildCRUDError('delete', 'user', err),
			),
		{
			user: ['delete'],
		},
	);

export default deleteUser;
