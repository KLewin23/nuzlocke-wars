import logger from '@/logger';
import { and, eq } from 'drizzle-orm';
import withSession from '@/func/withSession';
import { GetFullDraft } from '@/type/queries';
import buildCRUDError from '@/error/crudError';
import { db, draft, round, user, usersToDrafts } from '@/db';
import { type Either, eitherOr, leftOf, rightOf } from '@/util/either';
import { type QueryFailureState, type Success, notFound } from '@/util/query';

import noAuthCaptainSpend from '../noAuthCaptainSpend';

const getFullDraft = async (draftId: number): Promise<Either<QueryFailureState, Success<GetFullDraft>>> =>
	withSession(async session => {
		const baseQuery = db
			.select({
				name: draft.name,
				status: draft.status,
				roundLength: draft.roundLength,
				initialPlayerCoins: draft.initialPlayerCoins,
				maxPlayersPerTeam: draft.maxPlayersPerTeam,
				roundStatus: round.roundStatus,
				biddingStartTime: round.biddingStartTime,
				targetUser: {
					username: user.username,
					image: user.image,
				},
			})
			.from(draft)
			.innerJoin(round, eq(draft.currentRoundId, round.id))
			.leftJoin(user, eq(round.targetUserId, user.id))
			.innerJoin(usersToDrafts, eq(usersToDrafts.draftId, draft.id));

		const fullQuery =
			session.user.role === 'user' ?
				baseQuery.where(and(eq(draft.id, draftId), eq(usersToDrafts.userId, session.user.id)))
			:	baseQuery.where(eq(draft.id, draftId)).limit(1);
		const draftResponse = await eitherOr(fullQuery, err => buildCRUDError('read', 'draft', err));

		if (draftResponse._type === 'left') return draftResponse;
		if (draftResponse.value.length > 0) {
			logger.warn(`Received ${draftResponse.value.length} when expecting 1 in getFullDraft`);
		}
		const targetDraft = draftResponse.value.at(0);
		if (!targetDraft) return leftOf(notFound(`Target draft \`${draftId}\` not found in getFullDraft`));

		const captainSpends = await noAuthCaptainSpend(session, draftId);

		if (captainSpends._type === 'left') return captainSpends;

		const result: Success<GetFullDraft> = {
			type: 'Success' as const,
			data: {
				...targetDraft,
				captainSpend: captainSpends.value.data,
			},
		};

		return rightOf(result);
	});

export default getFullDraft;
