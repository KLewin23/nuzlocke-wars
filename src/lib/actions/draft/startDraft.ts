'use server';

import { and, eq } from 'drizzle-orm';
import type { PublishResult } from 'ably';
import { publishEvent } from '@/util/ably';
import { DraftStatus, db, draft } from '@/db';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { eitherOr, leftOf } from '@/util/either';
import { rejected, successOr } from '@/util/query';
import type { QueryState, Success } from '@/util/query';
import buildAblyPublishError from '@/error/ablyPublishError';

const startDraft = async (draftId: number): Promise<QueryState> =>
	adminSession<Success<PublishResult>>(
		async () => {
			const startDraftResponse = await eitherOr(
				db
					.update(draft)
					.set({
						status: DraftStatus.active,
					})
					.where(and(eq(draft.id, draftId), eq(draft.status, DraftStatus.open)))
					.returning({ id: draft.id }),
				err => buildCRUDError('update', 'draft', err),
			);

			if (startDraftResponse._type === 'left') return startDraftResponse;
			if (startDraftResponse.value.length === 0)
				return leftOf(
					rejected(
						`Draft was not found when try to modify status, it may have had the wrong DraftStatus expected: open`,
					),
				);

			return successOr(publishEvent(draftId, 'DraftStarted'), err => buildAblyPublishError('DraftStarted', err), false);
		},
		{
			draft: ['update'],
		},
	);

export default startDraft;
