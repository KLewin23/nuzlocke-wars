import logger from '@/logger';
import { and, eq } from 'drizzle-orm';
import type { auth } from '@/auth/auth';
import buildCRUDError from '@/error/crudError';
import type { DraftInfo } from '@/type/queries';
import { eitherOr, leftOf, rightOf } from '@/util/either';
import { db, draft, round, teamsToDrafts, user } from '@/db';
import { type QueryStateWithNonFailure, type Success, notFound } from '@/util/query';

// import getCaptainSpend from './getCaptainSpend';

const getDraftInfo = async (
	session: typeof auth.$Infer.Session,
	draftId: number,
): Promise<QueryStateWithNonFailure<Success<DraftInfo>>> => {
	const baseQuery = db
		.select({
			name: draft.name,
			status: draft.status,
			roundLength: draft.roundLength,
			initialPlayerCoins: draft.initialPlayerCoins,
			maxPlayersPerTeam: draft.maxPlayersPerTeam,
			roundStatus: round.roundStatus,
		})
		.from(draft)
		.innerJoin(round, eq(draft.currentRoundId, round.id))
		.leftJoin(user, eq(round.targetUserId, user.id))
		.innerJoin(teamsToDrafts, eq(teamsToDrafts.draftId, draft.id));

	const fullQuery =
		session?.user?.role === 'user' ?
			baseQuery.where(and(eq(draft.id, draftId), eq(teamsToDrafts.captainId, session.user.id)))
		:	baseQuery.where(eq(draft.id, draftId)).limit(1);
	const draftResponse = await eitherOr(fullQuery, err => buildCRUDError('read', 'draft', err));

	if (draftResponse._type === 'left') return draftResponse;
	if (draftResponse.value.length > 1)
		logger.warn(`Received ${draftResponse.value.length} when expecting 1 in getDraftInfo`);

	const targetDraft = draftResponse.value.at(0);
	if (!targetDraft) return leftOf(notFound(`Target draft \`${draftId}\` not found in getFullDraft`));

	return rightOf({
		type: 'Success' as const,
		data: targetDraft,
	});
};

export default getDraftInfo;
