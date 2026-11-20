import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './authSchema';

const ClipStatus = {
	Approved: 'approved',
	Ignored: 'ignored',
} as const;

type TClipStatus = (typeof ClipStatus)[keyof typeof ClipStatus];

const clipStatus = pgEnum('clip_status', ClipStatus);

const streamer = pgTable('streamer', {
	twitchId: text('twitch_id').notNull().primaryKey(),
	displayName: text('display_name').notNull(),
});

const clipCreator = pgTable('clip_creator', {
	twitchId: text('twitch_id').notNull().primaryKey(),
	name: text('display_name').notNull(),
});

const clip = pgTable('clip', {
	id: serial().notNull().primaryKey(),
	title: text('title').notNull(),
	url: text('url').notNull(),
	thumbnailUrl: text('thumbnail_url').notNull(),
	streamerId: text('streamer_id')
		.notNull()
		.references(() => streamer.twitchId, { onDelete: 'cascade' }),
	approverUserId: text('approver_user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	creatorId: text('creator_id').references(() => clipCreator.twitchId),
	status: clipStatus().notNull().default(ClipStatus.Ignored),
	loadedAt: timestamp('loaded_at').defaultNow().notNull(),
});

export type { TClipStatus };
export { clip, streamer, clipCreator, clipStatus, ClipStatus };
