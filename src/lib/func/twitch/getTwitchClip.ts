import z from 'zod';
import logger from '@/logger';
import { env } from '@/env/server';
import type { ArrElement } from '@/type/util';
import { leftOf, rightOf } from '@/util/either';
import buildActionError from '@/error/actionError';
import { badRequest, notFound, success } from '@/util/query';
import type { QueryStateWithNonFailure, Success } from '@/util/query';

import segmentString from '../segmentString';
import { withTwitchAuthentication } from './authentication';

const clipSchema = z.object({
	data: z.array(
		z.object({
			id: z.string(),
			title: z.string(),
			url: z.string(),
			thumbnail_url: z.string(),
			creator_id: z.string(),
			creator_name: z.string(),
			broadcaster_id: z.string(),
			broadcaster_name: z.string(),
		}),
	),
});

type GetClip = z.infer<typeof clipSchema>;
type SingularTwitchClip = ArrElement<GetClip['data']>;

const getTwitchClip = (clipUrl: string): Promise<QueryStateWithNonFailure<Success<SingularTwitchClip>>> =>
	withTwitchAuthentication<Success<SingularTwitchClip>>(async authentication => {
		const parsedClipUrl = URL.parse(clipUrl);

		if (parsedClipUrl === null) return leftOf(badRequest('Invalid clip URL was received.'));

		if (parsedClipUrl.host !== 'www.twitch.tv')
			return leftOf(badRequest('Clip URL must be a valid twitch clip with the domain `twitch.tv`'));

		const { channelName, clipId, clipString } = segmentString(parsedClipUrl.pathname.slice(1), '/', [
			'channelName',
			'clipString',
			'clipId',
		]);

		if (channelName._type === 'none' || clipId._type === 'none' || clipString._type === 'none') {
			const emptySegments = [
				channelName._type === 'none' ? 'Channel name' : '',
				clipId._type === 'none' ? 'Channel Id' : '',
				clipString._type === 'none' ? 'Clip Filler' : '',
			];
			logger.error(new Error(`Malformed Twitch URL received, missing: ${emptySegments.toString()}`));
			return leftOf(badRequest('Invalid clip URL was received.'));
		}

		if (clipString.data !== 'clip')
			return leftOf(badRequest('Invalid clip URL was received. Segment [1] to be `clip`'));

		const parameters = new URLSearchParams({
			id: clipId.data,
		});
		return fetch(`https://api.twitch.tv/helix/clips?${parameters}`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${authentication.access_token}`,
				'Client-ID': env.TWITCH_CLIENT_ID,
			},
			cache: 'no-store',
		})
			.then(async raw => {
				const json: unknown = await raw.json();
				const parsedResponse = clipSchema.safeParse(json);
				if (parsedResponse.success) {
					if (parsedResponse.data.data.length > 1)
						logger.info(`Recieved multiple twitch clips when expecting 1, target: ${clipId.data}`);
					const clip = parsedResponse.data.data.at(0);
					if (!clip) return leftOf(notFound('User was not found, or not live'));
					return rightOf(success(clip));
				}
				return leftOf(
					buildActionError(
						'parsing respose received from Twitch.tv',
						'parse response received from Twitch.tv',
						parsedResponse.error,
					),
				);
			})
			.catch(e => leftOf(buildActionError('contacting Twitch.tv to getClip', 'contact Twitch.tv to getClip', e)));
	});

export default getTwitchClip;
