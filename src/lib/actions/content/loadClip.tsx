'use server';

import { db } from '@/db';
import { successOr } from '@/util/query';
import buildActionError from '@/error/actionError';
import withAdminSession from '@/func/withAdminSession';
import getTwitchClip from '@/func/twitch/getTwitchClip';
import type { QueryStateWithNonFailure, Success } from '@/util/query';
import { ClipStatus, clip, clipCreator, streamer } from '@/db/contentSchema';

const loadClip = async (clipUrl: string, titleOverride?: string): Promise<QueryStateWithNonFailure<Success>> =>
	withAdminSession<Success>(
		async session => {
			const twitchClipResult = await getTwitchClip(clipUrl);
			if (twitchClipResult._type === 'left') return twitchClipResult;
			const twitchClip = twitchClipResult.value.data;

			return successOr(
				db.transaction(async tx => {
					await tx
						.insert(streamer)
						.values({ twitchId: twitchClip.broadcaster_id, displayName: twitchClip.broadcaster_name })
						.onConflictDoNothing();
					await tx
						.insert(clipCreator)
						.values({ twitchId: twitchClip.creator_id, name: twitchClip.creator_name })
						.onConflictDoNothing();
					await tx.insert(clip).values({
						title: titleOverride ?? twitchClip.title,
						approverUserId: session.user.id,
						streamerId: twitchClip.broadcaster_id,
						creatorId: twitchClip.creator_id,
						status: ClipStatus.Approved,
						url: twitchClip.url,
						thumbnailUrl: twitchClip.thumbnail_url,
					});
				}),
				err =>
					buildActionError(
						"load one of: clip, it's creator, it's streamer",
						"loading one of: clip, it's creator, it's streamer",
						err,
					),
			);
		},
		{ clip: ['create'] },
	);

export default loadClip;
