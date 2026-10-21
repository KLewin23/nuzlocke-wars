import * as Ably from 'ably';
import logger from '@/logger';
import { env } from '@/env/server';
import { internalServerError } from '@/util/query';
import { type Either, eitherOr } from '@/util/either';
import type { QueryFailureState, Success } from '@/util/query';

import adminSession from '../adminSession';

const adminGetSubscribeToken = (draftId: number): Promise<Either<QueryFailureState, Success<Ably.TokenRequest>>> =>
	adminSession(async session => {
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

export default adminGetSubscribeToken;
