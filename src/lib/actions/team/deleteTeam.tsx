'use server';

import { db, team } from '@/db';
import { eq } from 'drizzle-orm';
import adminSession from '@/func/adminSession';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

const deleteTeam = (teamId: number): Promise<QueryState> =>
	adminSession(async () =>
		successOr(db.delete(team).where(eq(team.id, teamId)), err => buildCRUDError('delete', 'team', err)),
	);

export default deleteTeam;
