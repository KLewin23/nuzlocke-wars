import Ably from 'ably';
import logger from '@/logger';
import { env } from '@/env/server';
import buildCRUDError from '@/error/crudError';
import { internalServerError } from '@/util/query';
import { and, eq, inArray, ne } from 'drizzle-orm';
import { DraftStatus, db, draft, usersToDrafts } from '@/db';
import { type Either, eitherOr, leftOf } from '@/util/either';
import type { QueryFailureState, Success } from '@/util/query';

import withSession from '../withSession';

const userGetDraftSubscribeToken = (draftId: number): Promise<Either<QueryFailureState, Success<Ably.TokenRequest>>> =>
	withSession(async session => {
		const draftIdWithAccess = await eitherOr(
			db
				.select({ id: draft.id })
				.from(draft)
				.innerJoin(usersToDrafts, eq(usersToDrafts.draftId, draft.id))
				.where(
					and(
						eq(draft.id, draftId),
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
			err => buildCRUDError('read', 'draft', err),
		);
		if (draftIdWithAccess._type === 'left') return draftIdWithAccess;
		if (draftIdWithAccess.value.length > 1)
			logger.warn(`Expected one draft per id received: ${draftIdWithAccess.value.length}`);

		if (draftIdWithAccess.value.length === 0)
			return leftOf({
				type: 'Forbidden' as const,
			});

		const client = new Ably.Rest(env.ABLY_SUBSCRIBE_API_KEY);
		const tokenRequestData = await eitherOr(
			client.auth
				.createTokenRequest({
					clientId: session.user.id,
					capability: JSON.stringify({
						[`${env.VERCEL_ENV}:${draftId}`]: ['subscribe'],
					}),
				})
				.then(data => ({ type: 'Success' as const, data })),
			err => {
				logger.error(err, `Failed to generate subscriber token`);
				return internalServerError('Failed to authenticate with event server.');
			},
		);
		return tokenRequestData;
	});

export default userGetDraftSubscribeToken;
