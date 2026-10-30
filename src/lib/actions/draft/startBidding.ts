'use server';
import { eq } from 'drizzle-orm';
import { publishEvent } from '@/util/ably';
import { RoundStatus, db, round } from '@/db';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { eitherOr, leftOf } from '@/util/either';
import { notFound, successOr } from '@/util/query';
import buildAblyPublishError from '@/error/ablyPublishError';
import type { QueryStateWithNonFailure, Success } from '@/util/query';

const startBidding = async (draftId: number): Promise<QueryStateWithNonFailure<Success>> =>
	adminSession(
		async () => {
			const currentRoundResponse = await eitherOr(
				db.query.draft.findFirst({ columns: { currentRoundId: true }, where: { id: draftId } }),
				err => buildCRUDError('read', 'draft', err),
			);

			if (currentRoundResponse._type === 'left') return currentRoundResponse;
			if (!currentRoundResponse.value?.currentRoundId)
				return leftOf(notFound('Current round could not be found.'));

			const updateResponse = await eitherOr(
				db
					.update(round)
					.set({ roundStatus: RoundStatus.bidding, biddingStartTime: new Date() })
					.where(eq(round.id, currentRoundResponse.value.currentRoundId)),
				err => buildCRUDError('update', 'round', err),
			);
			if (updateResponse._type === 'left') return updateResponse;
			return successOr(publishEvent(draftId, 'BiddingStarted'), err =>
				buildAblyPublishError('BiddingStarted', err),
			);
		},
		{
			draft: ['update'],
		},
	);
export default startBidding;
