'use server';

import { db, team } from '@/db';
import { eq } from 'drizzle-orm';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { type QueryState, successOr } from '@/util/query';

const deleteTeam = (teamName: string): Promise<QueryState> =>
	adminSession(
		async () => successOr(db.delete(team).where(eq(team.name, teamName)), err => buildCRUDError('delete', 'team', err)),
		{
			team: ['delete'],
		},
	);

export default deleteTeam;
