'use server';

import { and, eq } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { db, playersToDrafts } from '@/db';
import { type QueryState, successOr } from '@/util/query';

const deleteDraftToPlayer = (userId: string, draftId: number): Promise<QueryState> =>
	adminSession(
		async () =>
			successOr(
				db
					.delete(playersToDrafts)
					.where(and(eq(playersToDrafts.userId, userId), eq(playersToDrafts.draftId, draftId))),
				err => buildCRUDError('delete', 'draft to player mapping', err),
			),
		{
			draft: ['update'],
		},
	);

export default deleteDraftToPlayer;
