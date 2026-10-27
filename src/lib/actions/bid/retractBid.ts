'use server';

import { publishEvent } from '@/util/ably';
import withSession from '@/func/withSession';
import buildCRUDError from '@/error/crudError';
import { and, eq, inArray } from 'drizzle-orm';
import { type QueryState, successOr } from '@/util/query';
import buildAblyPublishError from '@/error/ablyPublishError';
import { RoundStatus, bid, db, round, teamsToDrafts } from '@/db';

const retractBid = async (bidId: number, draftId: number): Promise<QueryState> =>
	withSession(async session => {
		const deleteBidResponse = await successOr(
			db.delete(bid).where(
				and(
					eq(bid.id, bidId),
					inArray(
						bid.id,
						db
							.select({ data: bid.id })
							.from(bid)
							.innerJoin(
								teamsToDrafts,
								and(eq(teamsToDrafts.draftId, bid.draftId), eq(teamsToDrafts.teamName, bid.teamName)),
							)
							.innerJoin(round, eq(bid.roundId, round.id))
							.where(
								and(
									eq(round.roundStatus, RoundStatus.bidding),
									eq(teamsToDrafts.captainId, session.user.id),
								),
							),
					),
				),
			),
			err => buildCRUDError('read', 'bid', err),
		);
		if (deleteBidResponse._type === 'left') return deleteBidResponse;

		return successOr(publishEvent(draftId, 'BidRetracted'), err => buildAblyPublishError('BidRetracted', err));
	});

export default retractBid;
