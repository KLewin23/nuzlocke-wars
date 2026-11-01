import z from 'zod';
import { env } from '@/env/server';
import buildActionError from '@/error/actionError';

import { success } from '../../util/query';
import { Either, leftOf, rightOf } from '../../util/either';
import type { QueryFailureState, QueryStateWithNonFailure, Success } from '../../util/query';

const authenticationResponseSchema = z.object({
	access_token: z.string(),
	expires_in: z.number(),
	token_type: z.literal('bearer'),
});

type TwitchAuthentication = z.infer<typeof authenticationResponseSchema>;

const authenticationCode = (): Promise<QueryStateWithNonFailure<Success<TwitchAuthentication>>> =>
	fetch('https://id.twitch.tv/oauth2/token', {
		method: 'POST',
		body: new URLSearchParams({
			client_id: env.TWITCH_CLIENT_ID,
			client_secret: env.TWITCH_SECRET,
			grant_type: 'client_credentials',
		}),
	})
		.then(async raw => {
			const json: unknown = await raw.json();
			const parsedResponse = authenticationResponseSchema.safeParse(json);
			if (parsedResponse.success) return rightOf(success(parsedResponse.data));
			return leftOf(
				buildActionError(
					'parsing respose received from Twitch.tv',
					'parse response received from Twitch.tv',
					parsedResponse.error,
				),
			);
		})
		.catch(e =>
			leftOf(
				buildActionError('contacting Twitch.tv for authentication', 'contact Twitch.tv for authentication', e),
			),
		);

const withTwitchAuthentication = async <T>(
	withTwitchAuthentication: (authentication: TwitchAuthentication) => Promise<Either<QueryFailureState, T>>,
): Promise<Either<QueryFailureState, T>> => {
	const authCode = await authenticationCode();
	if (authCode._type === 'left') return authCode;
	return withTwitchAuthentication(authCode.value.data);
};

export { authenticationCode, withTwitchAuthentication };
