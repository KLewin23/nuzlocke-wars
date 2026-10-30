import { defineRelations } from 'drizzle-orm';

import { bid, draft, playersToDrafts, round, team, teamsToDrafts } from './draftSchema';
import { account, session, twoFactor, user, verification } from './authSchema';

const relations = defineRelations(
	{ user, session, account, verification, twoFactor, draft, playersToDrafts, round, teamsToDrafts, team, bid },
	r => ({
		user: {
			sessions: r.many.session({
				from: r.user.id,
				to: r.session.userId,
			}),
			accounts: r.many.account({
				from: r.user.id,
				to: r.account.userId,
			}),
			twoFactors: r.many.twoFactor({
				from: r.user.id,
				to: r.twoFactor.userId,
			}),
			drafts: r.many.draft({
				from: r.user.id.through(r.playersToDrafts.userId),
				to: r.draft.id.through(r.playersToDrafts.draftId),
			}),
			rounds: r.many.round({
				alias: 'target_user_relation',
			}),
		},
		session: {
			user: r.one.user({
				from: r.session.userId,
				to: r.user.id,
			}),
		},
		account: {
			user: r.one.user({
				from: r.account.userId,
				to: r.user.id,
			}),
		},
		twoFactor: {
			user: r.one.user({
				from: r.twoFactor.userId,
				to: r.user.id,
			}),
		},
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
		team: {
			drafts: r.many.draft(),
			bids: r.many.bid(),
		},
	}),
);

export default relations;
