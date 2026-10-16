'use server';

import { and, eq } from 'drizzle-orm';
import { publishEvent } from '@/util/ably';
import { DraftStatus, db, draft } from '@/db';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { eitherOr, rightOf } from '@/util/either';
import buildAblyPublishError from '@/error/ablyPublishError';
import { type QueryState, rejected, successOr } from '@/util/query';

const startDraft = async (draftId: number): Promise<QueryState> =>
	adminSession(async () => {
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
			return rightOf(
				rejected(
					`Draft was not found when try to modify status, it may have had the wrong DraftStatus expected: open`,
				),
			);

		return successOr(publishEvent(draftId, 'DraftStarted'), err => buildAblyPublishError('DraftStarted', err));
	});

export default startDraft;
