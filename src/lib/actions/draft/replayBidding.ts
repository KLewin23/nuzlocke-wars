'use server';

import logger from '@/logger';
import { and, eq } from 'drizzle-orm';
import { publishEvent } from '@/util/ably';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { eitherOr, leftOf } from '@/util/either';
import { RoundStatus, bid, db, draft, round } from '@/db';
import buildAblyPublishError from '@/error/ablyPublishError';
import { internalServerError, successOr } from '@/util/query';

const replayBidding = async (draftId: number) =>
	adminSession(
		async () => {
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
				db.transaction(async tx => {
					await tx
						.update(round)
						.set({ roundStatus: RoundStatus.pre_bidding, biddingStartTime: null })
						.where(eq(round.id, currentRound.roundId));
					await tx.delete(bid).where(and(eq(bid.roundId, currentRound.roundId), eq(bid.draftId, draftId)));
				}),
				err => buildCRUDError('update', 'round and bid', err),
			);

			if (endBiddinResponse._type === 'left') return endBiddinResponse;

			return successOr(publishEvent(draftId, 'BiddingToBeReplayed'), err =>
				buildAblyPublishError('BiddingToBeReplayed', err),
			);
		},
		{
			draft: ['update'],
		},
	);

export default replayBidding;
