import z from 'zod';
import logger from '@/logger';
import { env } from '@/env/server';
import type { ArrElement } from '@/type/util';
import { leftOf, rightOf } from '@/util/either';
import { notFound, success } from '@/util/query';
import buildActionError from '@/error/actionError';
import type { QueryStateWithNonFailure, Success } from '@/util/query';

import { withTwitchAuthentication } from './authentication';

const channelSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
		}),
	),
});

type GetTwitchChannel = z.infer<typeof channelSchema>;
type SingularTwitchChannel = ArrElement<GetTwitchChannel['data']> & { usersLoginName: string };

const getTwitchChannel = (
	usersLoginName: string,
	liveOnly: boolean,
): Promise<QueryStateWithNonFailure<Success<SingularTwitchChannel>>> =>
	withTwitchAuthentication(authentication => {
		const parameters = new URLSearchParams({
			query: usersLoginName,
			live_only: liveOnly === true ? 'true' : 'false',
			first: '1',
		});
		return fetch(`https://api.twitch.tv/helix/search/channels?${parameters}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${authentication.access_token}`,
				'Client-ID': env.TWITCH_CLIENT_ID,
			},
		})
			.then(async raw => {
				const json: unknown = await raw.json();
				const parsedResponse = channelSchema.safeParse(json);
				if (parsedResponse.success) {
					if (parsedResponse.data.data.length > 1)
						logger.info(`Recieved multiple twitch channels when expecting 1, target: ${usersLoginName}`);
					const channel = parsedResponse.data.data.at(0);
					if (!channel) return leftOf(notFound('User was not found, or not live'));
					return rightOf(success({ ...channel, usersLoginName }));
				}
				return leftOf(
					buildActionError(
						'parsing respose received from Twitch.tv',
						'parse response received from Twitch.tv',
						parsedResponse.error,
					),
				);
			})
			.catch(e =>
				leftOf(buildActionError('contacting Twitch.tv to getChannel', 'contact Twitch.tv to getChannel', e)),
			);
	});

export type { GetTwitchChannel, SingularTwitchChannel };
export default getTwitchChannel;
