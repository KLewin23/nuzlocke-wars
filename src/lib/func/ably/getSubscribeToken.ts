import * as Ably from 'ably';
import logger from '@/logger';
import { env } from '@/env/server';
import { internalServerError } from '@/util/query';
import { type Either, eitherOr } from '@/util/either';
import type { QueryFailureState, Success } from '@/util/query';

const getSubscribeToken = async (
	draftId: number,
	userId: string,
): Promise<Either<QueryFailureState, Success<Ably.TokenRequest>>> => {
	const client = new Ably.Rest(env.ABLY_SUBSCRIBE_API_KEY);
	const tokenRequestData = await eitherOr(
		client.auth
			.createTokenRequest({
				clientId: userId,
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
};

export default getSubscribeToken;
