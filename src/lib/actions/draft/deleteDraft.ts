'use server';

import { db, draft } from '@/db';
import { eq } from 'drizzle-orm';
import { successOr } from '@/util/query';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';

const deleteDraft = async (draftId: number) =>
	adminSession(
		() =>
			successOr(db.delete(draft).where(eq(draft.id, draftId)), err =>
				buildCRUDError('delete', 'draft state', err),
			),
		{
			draft: ['update'],
		},
	);

export default deleteDraft;
