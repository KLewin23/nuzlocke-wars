'use server';

import { db, team } from '@/db';
import adminSession from '@/func/adminSession';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

interface CreateTeamPayload {
	name: string;
	imageUrl?: string;
}

const createTeam = ({ name, imageUrl }: CreateTeamPayload): Promise<QueryState> =>
	adminSession(async () =>
		successOr(db.insert(team).values({ displayName: name, image: imageUrl }), err =>
			buildCRUDError('create', 'team', err),
		),
	);

export default createTeam;
