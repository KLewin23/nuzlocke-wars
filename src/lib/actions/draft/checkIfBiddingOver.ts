'use server';

import logger from '@/logger';
import { publishEvent } from '@/util/ably';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { RoundStatus, bid, db, draft, round } from '@/db';
import { eitherOr, leftOf, rightOf } from '@/util/either';
import { and, desc, eq, inArray, sql } from 'drizzle-orm';
import buildAblyPublishError from '@/error/ablyPublishError';
import { internalServerError, successOr } from '@/util/query';

const checkIfBiddingOver = (draftId: number) =>
	adminSession(async () => {
		const checkResponse = await eitherOr(
			db
				.select({
					roundId: round.id,
					roundStatus: round.roundStatus,
					roundOverdue: sql`${new Date()} > ${round.biddingStartTime} + ${draft.roundLength} * interval '1 second'`,
				})
				.from(draft)
				.innerJoin(round, eq(draft.currentRoundId, round.id)),
			err => buildCRUDError('read', 'draft state', err),
		);
		if (checkResponse._type === 'left') return checkResponse;
		const currentRound = checkResponse.value.at(0);
		if (currentRound === undefined) {
			logger.error('Did not find round associated with draft when checking bidding.');
			return leftOf(internalServerError('Round not found for draft.'));
		}

		// if round not over, reply 200 as the request was fine, the lack of event will make the UI check again later.
		if (currentRound.roundOverdue === false)
			return rightOf({
				type: 'Success' as const,
			});

		const highestBid = db.select({ data: bid.amount }).from(bid).limit(1).orderBy(desc(bid.amount));

		const setWinnerResponse = await eitherOr(
			db.transaction(tx =>
				Promise.all([
					tx
						.update(round)
						.set({ roundStatus: RoundStatus.post_bidding })
						.where(eq(round.id, currentRound.roundId)),
					tx
						.update(bid)
						.set({ isWinner: true })
						.where(and(eq(bid.roundId, currentRound.roundId), inArray(bid.id, highestBid))),
				]),
			),
			err => buildCRUDError('update', 'round and bid', err),
		);

		if (setWinnerResponse._type === 'left') return setWinnerResponse;

		return successOr(publishEvent(draftId, 'BiddingEnded'), err => buildAblyPublishError('BiddingEnded', err));
	});

export default checkIfBiddingOver;
