import { db } from '@/db';
import { eq } from 'drizzle-orm';
import { type Either } from '@/util/either';
import buildCRUDError from '@/error/crudError';
import type { BareTwitchClip } from '@/type/twitch';
import { clip, clipCreator, streamer } from '@/db/contentSchema';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

import withAdminSession from '../withAdminSession';

const getClips = async (): Promise<Either<QueryFailureState, Success<Array<BareTwitchClip>>>> =>
	withAdminSession(
		async () =>
			successOr(
				db
					.select({
						id: clip.id,
						title: clip.title,
						status: clip.status,
						creatorName: clipCreator.name,
						broadcasterName: streamer.displayName,
					})
					.from(clip)
					.leftJoin(clipCreator, eq(clip.creatorId, clipCreator.twitchId))
					.innerJoin(streamer, eq(clip.streamerId, streamer.twitchId)),

				err => buildCRUDError('read', 'clips', err),
				false,
			),
		{
			clip: ['read'],
		},
	);

export default getClips;
