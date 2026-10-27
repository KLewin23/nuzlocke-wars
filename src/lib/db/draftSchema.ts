import { defineRelationsPart } from 'drizzle-orm';
import {
	type AnyPgColumn,
	foreignKey,
	integer,
	pgEnum,
	pgTable,
	primaryKey,
	serial,
	text,
	timestamp,
	unique,
} from 'drizzle-orm/pg-core';

import { user } from './authSchema';

enum DraftStatus {
	closed = 'closed',
	open = 'open',
	active = 'active',
	complete = 'complete',
}

const draftStatus = pgEnum('draft_status', DraftStatus);

enum RoundStatus {
	pre_bidding = 'pre_bidding',
	bidding = 'bidding',
	post_bidding = 'post_bidding',
}

const roundStatus = pgEnum('round_status', RoundStatus);

const draft = pgTable('draft', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	status: draftStatus('status').notNull().default(DraftStatus.closed),
	roundLength: integer('round_length').notNull().default(60), //seconds
	initialPlayerCoins: integer('initial_player_coins').notNull().default(60),
	maxPlayersPerTeam: integer('max_players_per_team').notNull().default(8),
	currentRoundId: integer('current_round_id').references((): AnyPgColumn => round.id),
});

const round = pgTable('round', {
	id: serial('id').primaryKey(),
	draftId: integer('draft_id')
		.notNull()
		.references((): AnyPgColumn => draft.id, { onDelete: 'cascade' }),
	targetUserId: text('target_user_id')
		.notNull()
		.references(() => user.id),
	roundStatus: roundStatus('round_status').notNull().default(RoundStatus.pre_bidding),
	biddingStartTime: timestamp('bidding_start_time', { mode: 'date' }), // MUST BE UTC
}, t => [
	unique('targeted_user').on(t.draftId, t.targetUserId)
]);

const bid = pgTable(
	'bid',
	{
		id: serial('id').primaryKey(),
		draftId: integer('draft_id').notNull(),
		teamName: text('team_name').notNull(),
		roundId: integer('round_id')
			.notNull()
			.references(() => round.id, { onDelete: 'cascade' }),
		amount: integer('amount').notNull(),
	},
	table => [
		unique('draft_teams_bid').on(table.draftId, table.roundId, table.teamName),
		foreignKey({
			columns: [table.draftId, table.teamName],
			foreignColumns: [teamsToDrafts.draftId, teamsToDrafts.teamName],
			name: 'draft_team',
		}).onDelete('cascade'),
	],
);

const team = pgTable('team', {
	name: text('name').primaryKey(),
});

const playersToDrafts = pgTable(
	'players_to_drafts',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		draftId: integer('draft_id')
			.notNull()
			.references(() => draft.id),
		teamName: text('team_name').references(() => team.name, { onDelete: 'cascade' }),
	},
	t => [primaryKey({ columns: [t.draftId, t.userId] })],
);

const teamsToDrafts = pgTable(
	'teams_to_drafts',
	{
		teamName: text('team_name')
			.notNull()
			.references(() => team.name, { onDelete: 'cascade' }),
		draftId: integer('draft_id')
			.notNull()
			.references(() => draft.id, { onDelete: 'cascade' }),
		captainId: text('captain_id').notNull(),
	},
	t => [
		unique('one_captain').on(t.draftId, t.captainId),
		primaryKey({ columns: [t.teamName, t.draftId] })
	],
);

const draftRelations = defineRelationsPart({ user, draft, team, round, bid, playersToDrafts, teamsToDrafts }, r => ({
	draft: {
		players: r.many.user(),
		team: r.many.team({
			from: r.draft.id.through(r.teamsToDrafts.draftId),
			to: r.team.name.through(r.teamsToDrafts.teamName),
		}),
		rounds: r.many.round({
			alias: 'parent_draft_relation',
		}),
		currentRound: r.one.round({
			alias: 'current_round_relation',
			from: r.draft.currentRoundId,
			to: r.round.id,
		}),
	},
	round: {
		draft: r.one.draft({
			alias: 'parent_draft_relation',
			from: r.round.draftId,
			to: r.draft.id,
		}),
		bids: r.many.bid(),
		target: r.one.user({
			alias: 'target_user_relation',
			from: r.round.targetUserId,
			to: r.user.id,
		}),
	},
	bid: {
		round: r.one.round({
			from: r.bid.id,
			to: r.round.id,
		}),
		team: r.one.team({
			from: r.bid.teamName.through(r.teamsToDrafts.teamName),
			to: r.team.name.through(r.teamsToDrafts.teamName),
		}),
		draft: r.one.draft({
			from: r.bid.draftId.through(r.teamsToDrafts.draftId),
			to: r.draft.id.through(r.teamsToDrafts.draftId),
		}),
	},
	user: {
		drafts: r.many.draft({
			from: r.user.id.through(r.playersToDrafts.userId),
			to: r.draft.id.through(r.playersToDrafts.draftId),
		}),
		rounds: r.many.round({
			alias: 'target_user_relation',
		}),
	},
	team: {
		drafts: r.many.draft(),
		bids: r.many.bid()
	},
}));

export {
	bid,
	draft,
	draftRelations,
	draftStatus,
	DraftStatus,
	playersToDrafts,
	round,
	roundStatus,
	RoundStatus,
	team,
	teamsToDrafts,
};
