'use server';

import withSession from '@/func/withSession';
import { and, eq, inArray } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import { RoundStatus, bid, db, draft, round } from '@/db';
import { type QueryState, successOr } from '@/util/query';

const updateBid = (draftId: number, bidId: number, newBidAmount: number): Promise<QueryState> =>
	withSession(async session =>
		successOr(
			db
				.update(bid)
				.set({
					amount: newBidAmount,
				})
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
								.where(and(eq(round.roundStatus, RoundStatus.bidding), eq(round.draftId, draftId))),
						),
					),
				),
			err => buildCRUDError('read', 'bid', err),
		),
	);

export default updateBid;
