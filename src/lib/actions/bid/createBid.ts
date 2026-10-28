'use server';

import logger from '@/logger';
import { publishEvent } from '@/util/ably';
import withSession from '@/func/withSession';
import buildCRUDError from '@/error/crudError';
import { eitherOr, leftOf } from '@/util/either';
import { and, count, eq, sql } from 'drizzle-orm';
import buildAblyPublishError from '@/error/ablyPublishError';
import { type QueryState, type Success, rejected, successOr } from '@/util/query';
import { DraftStatus, RoundStatus, bid, db, draft, playersToDrafts, round, teamsToDrafts } from '@/db';

const createBid = async (draftId: number, bidAmount: number): Promise<QueryState> =>
	withSession<Success>(async session => {
		const currentRound = await eitherOr(
			db
				.select({
					roundId: round.id,
					teamName: teamsToDrafts.teamName,
					existingPlayers: count(playersToDrafts.userId),
					maxPlayersPerTeam: draft.maxPlayersPerTeam,
				})
				.from(draft)
				.innerJoin(round, eq(round.id, draft.currentRoundId))
				.innerJoin(teamsToDrafts, eq(teamsToDrafts.draftId, draft.id))
				.innerJoin(
					playersToDrafts,
					and(eq(playersToDrafts.draftId, draft.id), eq(playersToDrafts.teamName, teamsToDrafts.teamName)),
				)
				.where(
					and(
						eq(teamsToDrafts.captainId, session.user.id),
						eq(round.roundStatus, RoundStatus.bidding),
						eq(draft.status, DraftStatus.active),
						sql`${new Date()} < ${round.biddingStartTime} + ${draft.roundLength} * interval '1 second'`,
					),
				)
				.groupBy(round.id, teamsToDrafts.teamName, draft.maxPlayersPerTeam),
			err => buildCRUDError('read', 'bid', err),
		);

		if (currentRound._type === 'left') return currentRound;
		if (currentRound.value.length > 1) logger.warn('Multiple rounds found during bid creation.');

		const onlyCurrentRound = currentRound.value.at(0);
		if (onlyCurrentRound === undefined) return leftOf(rejected('Round was not found, it may have closed.'));
		if (onlyCurrentRound.existingPlayers + 1 === onlyCurrentRound.maxPlayersPerTeam)
			return leftOf(
				rejected(`Team already has maximum number of players of: ${onlyCurrentRound.maxPlayersPerTeam}`),
			);

		const createBidResponse = await eitherOr(
			db.insert(bid).values({
				roundId: onlyCurrentRound.roundId,
				teamName: onlyCurrentRound.teamName,
				draftId: draftId,
				amount: bidAmount,
			}),
			err => buildCRUDError('create', 'bid', err),
		);
		if (createBidResponse._type === 'left') return createBidResponse;
		return successOr(publishEvent(draftId, 'BidSubmitted'), err => buildAblyPublishError('BidSubmitted', err));
	});

export default createBid;
