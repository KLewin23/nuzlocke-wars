import z from 'zod';
import Ably from 'ably';
import logger from '@/logger';
import { auth } from '@/auth/auth';
import { env } from '@/env/server';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import { eitherOr, unwrap } from '@/util/either';
import { and, eq, inArray, ne } from 'drizzle-orm';
import routeErrorResponse from '@/func/routErrorResponse';
import { forbidden, unauthorized } from 'next/navigation';
import { DraftStatus, db, draft, usersToDrafts } from '@/db';

const POST = async (request: Request) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) return unauthorized();
	const data = await request.formData();
	const parseDraftId = z.coerce.number().safeParse(data.get('draftId'));
	if (!parseDraftId.success) return routeErrorResponse(`Could not parse draftId \`${parseDraftId.data}\``, 400);

	const draftIdWithAccess = await eitherOr(
		db
			.select({ id: draft.id })
			.from(draft)
			.innerJoin(usersToDrafts, eq(usersToDrafts.draftId, draft.id))
			.where(
				and(
					eq(draft.id, parseDraftId.data),
					eq(usersToDrafts.userId, session.user.id),
					ne(draft.status, DraftStatus.closed),
					inArray(
						draft.id,
						db
							.select({ data: usersToDrafts.draftId })
							.from(usersToDrafts)
							.where(eq(usersToDrafts.userId, session.user.id)),
					),
				),
			),
		err => {
			logger.error(
				Error.isError(err) ? err : new Error(`Unhandled data read error occurred reading a \`draft\` `),
			);
			return routeErrorResponse(`Failed to read draft from database.`, 500);
		},
	);
	if (draftIdWithAccess._type === 'left') return draftIdWithAccess.value;
	if (draftIdWithAccess.value.length > 1)
		logger.warn(`Expected one draft per id received: ${draftIdWithAccess.value.length}`);

	if (draftIdWithAccess.value.length === 0) return forbidden();

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
