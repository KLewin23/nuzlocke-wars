import { db } from '@/db';
import { desc, eq } from 'drizzle-orm';
import { type Either } from '@/util/either';
import buildCRUDError from '@/error/crudError';
import type { DisplayTwitchClip } from '@/type/twitch';
import { clip, clipCreator, streamer } from '@/db/contentSchema';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

const getClips = async (
	pageSize: number,
	cursor: number,
): Promise<Either<QueryFailureState, Success<Array<DisplayTwitchClip>>>> =>
	successOr(
		db
			.select({
				id: clip.id,
				title: clip.title,
				url: clip.url,
				status: clip.status,
				creatorName: clipCreator.name,
				thumbnailUrl: clip.thumbnailUrl,
				broadcasterName: streamer.displayName,
			})
			.from(clip)
			.leftJoin(clipCreator, eq(clip.creatorId, clipCreator.twitchId))
			.innerJoin(streamer, eq(clip.streamerId, streamer.twitchId))
			.orderBy(desc(clip.loadedAt))
			.offset(cursor)
			.limit(pageSize),
		err => buildCRUDError('read', 'drafts', err),
		false,
	);

export default getClips;
