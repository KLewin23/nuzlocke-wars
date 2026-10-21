'use server';
import { eitherOr } from '@/util/either';
import { successOr } from '@/util/query';
import { publishEvent } from '@/util/ably';
import { RoundStatus, db, round } from '@/db';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import buildAblyPublishError from '@/error/ablyPublishError';
import type { QueryStateWithNonFailure, Success } from '@/util/query';

const startNextRound = async (draftId: number): Promise<QueryStateWithNonFailure<Success>> =>
	adminSession(
		async () => {
			const updateResponse = await eitherOr(
				db.update(round).set({ roundStatus: RoundStatus.bidding, biddingStartTime: new Date(), draftId }),
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
export default startNextRound;
