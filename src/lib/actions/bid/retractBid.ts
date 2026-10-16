'use server';

import { publishEvent } from '@/util/ably';
import withSession from '@/func/withSession';
import buildCRUDError from '@/error/crudError';
import { and, eq, inArray } from 'drizzle-orm';
import { RoundStatus, bid, db, draft, round } from '@/db';
import { type QueryState, successOr } from '@/util/query';
import buildAblyPublishError from '@/error/ablyPublishError';

const updateBid = (bidId: number, draftId: number): Promise<QueryState> =>
	withSession(async session => {
		const deleteBidResponse = await successOr(
			db
				.delete(bid)
				.where(
					and(
						eq(bid.id, bidId),
						eq(bid.userId, session.user.id),
						inArray(
							bid.id,
							db
								.select({ roundId: round.id })
								.from(round)
								.innerJoin(draft, eq(draft.currentRoundId, round.id))
								.where(and(eq(round.roundStatus, RoundStatus.bidding), eq(draft.id, round.draftId))),
						),
					),
				)
				.returning({}),
			err => buildCRUDError('read', 'bid', err),
		);
		if (deleteBidResponse._type === 'left') return deleteBidResponse;

		return successOr(publishEvent(draftId, 'BidRetracted'), err => buildAblyPublishError('BidRetracted', err));
	});

export default updateBid;
