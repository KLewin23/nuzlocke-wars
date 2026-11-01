'use server';

import { eq } from 'drizzle-orm';
import { successOr } from '@/util/query';
import { DraftStatus, db, draft } from '@/db';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';

const archiveDraft = async (draftId: number) =>
	adminSession(
		() =>
			successOr(db.update(draft).set({ status: DraftStatus.archived }).where(eq(draft.id, draftId)), err =>
				buildCRUDError('update', 'draft state', err),
			),
		{
			draft: ['update'],
		},
	);

export default archiveDraft;
