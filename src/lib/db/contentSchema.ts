import { pgTable, text } from 'drizzle-orm/pg-core';

import { user } from './authSchema';

const streamer = pgTable('streamer', {
	id: text('id').notNull().primaryKey(),
	displayName: text('display_name').notNull(),
});

const clip = pgTable('clip', {
	url: text('url'),
	streamerId: text('streamer_id')
		.notNull()
		.references(() => streamer.id, { onDelete: 'cascade' }),
	approverUserId: text('approver_user_id')
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
});

export { clip, streamer };
