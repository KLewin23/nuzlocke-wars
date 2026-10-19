import { defineRelationsPart } from 'drizzle-orm';
import { type AnyPgColumn, boolean, integer, pgEnum, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core';

import { user } from './authSchema';

enum DraftStatus {
	closed = 'closed',
	open = 'open',
	active = 'active',
	complete = 'complete',
}

const draftStatus = pgEnum('draft_status', DraftStatus);

enum TeamRole {
	captain = 'captain',
	player = 'player',
}

const teamRole = pgEnum('team_role', TeamRole);

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
	initialPlayerCoins: integer('initial_player_coins').default(60),
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
});

const bid = pgTable('bid', {
	id: serial('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	roundId: integer('round_id')
		.notNull()
		.references(() => round.id, { onDelete: 'cascade' }),
	amount: integer('amount').notNull(),
	isWinner: boolean()
});

const team = pgTable('team', {
	id: serial('id').primaryKey(),
	displayName: text('display_name').notNull().unique(),
	image: text('image'),
});

const usersToDrafts = pgTable(
	'users_to_drafts',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		draftId: integer('draft_id')
			.notNull()
			.references(() => draft.id),
		teamId: integer('team_id').references(() => team.id),
		teamRole: teamRole('team_role').notNull(),
	},
	t => [primaryKey({ columns: [t.draftId, t.userId] })],
);

const teamsToDrafts = pgTable(
	'teams_to_drafts',
	{
		teamId: integer('team_id')
			.notNull()
			.references(() => team.id),
		draftId: integer('draft_id')
			.notNull()
			.references(() => draft.id),
	},
	t => [primaryKey({ columns: [t.teamId, t.draftId] })],
);

const draftRelations = defineRelationsPart({ user, draft, team, round, bid, usersToDrafts, teamsToDrafts }, r => ({
	draft: {
		players: r.many.user(),
		team: r.many.team({
			from: r.draft.id.through(r.teamsToDrafts.draftId),
			to: r.team.id.through(r.teamsToDrafts.teamId),
		}),
		rounds: r.many.round({
			alias: 'parent_draft_relation',
		}),
		currentRound: r.one.round({
			alias: 'current_round_rlaton',
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
		user: r.one.user({
			from: r.bid.userId,
			to: r.user.id,
		}),
	},
	user: {
		drafts: r.many.draft({
			from: r.user.id.through(r.usersToDrafts.userId),
			to: r.draft.id.through(r.usersToDrafts.draftId),
		}),
		bids: r.many.bid(),
		rounds: r.many.round({
			alias: 'target_user_relation',
		}),
	},
	team: {
		drafts: r.many.draft(),
	},
}));

export {
	bid,
	draft,
	draftRelations,
	draftStatus,
	round,
	roundStatus,
	team,
	teamRole,
	teamsToDrafts,
	usersToDrafts,
	DraftStatus,
	RoundStatus,
	TeamRole,
};
