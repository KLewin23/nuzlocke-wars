'use server';

import { and, eq } from 'drizzle-orm';
import { db, usersToDrafts } from '@/db';
import adminSession from '@/func/adminSession';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

const deleteDraftToPlayer = (userId: string, draftId: number): Promise<QueryState> =>
	adminSession(async () =>
		successOr(
			db.delete(usersToDrafts).where(and(eq(usersToDrafts.userId, userId), eq(usersToDrafts.draftId, draftId))),
			err => buildCRUDError('delete', 'draft to player mapping', err),
		),
	);

export default deleteDraftToPlayer;
