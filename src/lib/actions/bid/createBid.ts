'use server';

import logger from '@/logger';
import { publishEvent } from '@/util/ably';
import { and, eq, sql } from 'drizzle-orm';
import withSession from '@/func/withSession';
import buildCRUDError from '@/error/crudError';
import { eitherOr, leftOf } from '@/util/either';
import buildAblyPublishError from '@/error/ablyPublishError';
import { type QueryState, type Success, rejected, successOr } from '@/util/query';
import { DraftStatus, RoundStatus, TeamRole, bid, db, draft, round, usersToDrafts } from '@/db';

const createBid = (draftId: number, bidAmount: number): Promise<QueryState> =>
	withSession<Success>(async session => {
		const currentRound = await eitherOr(
			db
				.select({
					roundId: round.id,
				})
				.from(usersToDrafts)
				.innerJoin(draft, eq(draft.id, usersToDrafts.draftId))
				.innerJoin(round, eq(round.id, draft.currentRoundId))
				.where(
					and(
						eq(usersToDrafts.userId, session.user.id),
						eq(usersToDrafts.draftId, draftId),
						eq(usersToDrafts.teamRole, TeamRole.captain),
						eq(draft.status, DraftStatus.active),
						eq(round.roundStatus, RoundStatus.bidding),
						sql`${new Date()} < ${round.biddingStartTime} + ${draft.roundLength} * interval '1 second'`,
					),
				),
			err => buildCRUDError('read', 'bid', err),
		);

		if (currentRound._type === 'left') return currentRound;
		if (currentRound.value.length > 1) logger.warn('Multiple rounds found during bid creation.');

		const onlyCurrentRound = currentRound.value.at(0);
		if (onlyCurrentRound === undefined) return leftOf(rejected('Round was not found, it may have closed.'));

		const createBidResponse = await eitherOr(
			db.insert(bid).values({ roundId: onlyCurrentRound.roundId, userId: session.user.id, amount: bidAmount }),
			err => buildCRUDError('create', 'bid', err),
		);
		if (createBidResponse._type === 'left') return createBidResponse;
		return successOr(publishEvent(draftId, 'BidSubmitted'), err => buildAblyPublishError('BidSubmitted', err));
	});

export default createBid;
