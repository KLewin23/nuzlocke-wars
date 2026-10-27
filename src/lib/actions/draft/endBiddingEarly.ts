'use server';

import logger from '@/logger';
import { eq } from 'drizzle-orm';
import { publishEvent } from '@/util/ably';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { eitherOr, leftOf } from '@/util/either';
import { RoundStatus, db, draft, round } from '@/db';
import buildAblyPublishError from '@/error/ablyPublishError';
import { internalServerError, successOr } from '@/util/query';

const endBiddingEarly = async (draftId: number) =>
	adminSession(async () => {
		const checkResponse = await eitherOr(
			db
				.select({
					roundId: round.id,
					roundStatus: round.roundStatus,
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

		const endBiddinResponse = await eitherOr(
			db.update(round).set({ roundStatus: RoundStatus.post_bidding }).where(eq(round.id, currentRound.roundId)),
			err => buildCRUDError('update', 'round and bid', err),
		);

		if (endBiddinResponse._type === 'left') return endBiddinResponse;

		return successOr(publishEvent(draftId, 'BiddingEnded'), err => buildAblyPublishError('BiddingEnded', err));
	});

export default endBiddingEarly;
