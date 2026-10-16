'use server';
import logger from '@/logger';
import * as Ably from 'ably';
import { env } from '@/env/server';
import withSession from '@/func/withSession';
import { internalServerError } from '@/util/query';
import { type Either, eitherOr } from '@/util/either';
import type { Created, QueryFailureState } from '@/util/query';

const getSubscribeToken = (draftId: number): Promise<Either<QueryFailureState, Created<Ably.TokenRequest>>> =>
	withSession(async session => {
		const client = new Ably.Rest(env.ABLY_SUBSCRIBE_API_KEY);
		const tokenRequestData = await eitherOr(
			client.auth
				.createTokenRequest({
					clientId: session.user.id,
					capability: JSON.stringify({
						[`${env.VERCEL_ENV}:${draftId}`]: ['subscribe'],
					}),
				})
				.then(data => ({ type: 'Created' as const, data })),
			err => {
				logger.error(err, `Failed to generate subscriber token`);
				return internalServerError('Failed to authenticate with event server.');
			},
		);
		return tokenRequestData;
	});

export default getSubscribeToken;
