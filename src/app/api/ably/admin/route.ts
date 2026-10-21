import z from 'zod';
import Ably from 'ably';
import logger from '@/logger';
import { auth } from '@/auth/auth';
import { env } from '@/env/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { forbidden, unauthorized } from 'next/navigation';
import { eitherOr, unwrap } from '@/util/either';
import routeErrorResponse from '@/func/routErrorResponse';

const POST = async (request: Request) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) return unauthorized();

	const hasPermission = await auth.api.userHasPermission({
		body: {
			userId: session?.user.id,
			role: 'admin',
			permissions: {},
		},
	});
	if (!hasPermission) return forbidden()

	const data = await request.formData();
	const parseDraftId = z.number().safeParse(data.get('draftId'));
	if (!parseDraftId.success) return routeErrorResponse(`Could not parse draftId \`${parseDraftId.data}\``, 400);

	const client = new Ably.Rest(env.ABLY_SUBSCRIBE_API_KEY);
	const tokenRequestData = await eitherOr(
		client.auth
			.createTokenRequest({
				clientId: session.user.id,
				capability: JSON.stringify({
					[`${env.VERCEL_ENV}:${parseDraftId.data}`]: ['subscribe'],
				}),
			})
			.then(data => NextResponse.json(data)),
		err => {
			logger.error(err, `Failed to generate subscriber token`);
			return routeErrorResponse('Failed to authenticate with event server.', 500);
		},
	);
	return unwrap(tokenRequestData);
};

export { POST };
