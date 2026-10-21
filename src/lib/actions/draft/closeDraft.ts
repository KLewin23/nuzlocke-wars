'use server';
import { and, eq } from 'drizzle-orm';
import { successOr } from '@/util/query';
import { DraftStatus, db, draft } from '@/db';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import type { QueryStateWithNonFailure, Success } from '@/util/query';

const closeDraft = async (draftId: number): Promise<QueryStateWithNonFailure<Success>> =>
	adminSession<Success>(
		async () =>
			successOr(
				db
					.update(draft)
					.set({ status: DraftStatus.closed })
					.where(and(eq(draft.status, DraftStatus.open), eq(draft.id, draftId))),
				err => buildCRUDError('update', 'draft', err),
			),
		{
			draft: ['update'],
		},
	);
export default closeDraft;
