'use server';

import { db, team } from '@/db';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { type QueryState, successOr } from '@/util/query';

interface CreateTeamPayload {
	name: string;
	imageUrl?: string;
}

const createTeam = ({ name, imageUrl }: CreateTeamPayload): Promise<QueryState> =>
	adminSession(
		async () =>
			successOr(db.insert(team).values({ name, image: imageUrl }), err =>
				buildCRUDError('create', 'team', err),
			),
		{
			team: ['create'],
		},
	);

export default createTeam;
