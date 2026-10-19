'use server';

import { and, eq } from 'drizzle-orm';
import { db, teamsToDrafts } from '@/db';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { type QueryState, successOr } from '@/util/query';

const deleteDraftToTeam = (teamId: number, draftId: number): Promise<QueryState> =>
	adminSession(
		async () =>
			successOr(
				db
					.delete(teamsToDrafts)
					.where(and(eq(teamsToDrafts.teamId, teamId), eq(teamsToDrafts.draftId, draftId))),
				err => buildCRUDError('delete', 'draft to team mapping', err),
			),
		{
			draft: ['update'],
		},
	);

export default deleteDraftToTeam;
