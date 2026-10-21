'use server';

import { db, team } from '@/db';
import { eq } from 'drizzle-orm';
import { leftOf } from '@/util/either';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { type QueryState, badRequest, successOr } from '@/util/query';

interface UpdateTeamPayload {
	name?: string;
	imageUrl?: string;
}

const deleteTeam = (teamName: string, { name, imageUrl }: UpdateTeamPayload): Promise<QueryState> =>
	adminSession(
		async () => {
			if (name === undefined && imageUrl === undefined)
				return leftOf(badRequest(`Properties [name, imageUrl] where both undefined, one must be defined`));
			return successOr(
				db
					.update(team)
					.set({
						...(name !== undefined ? { displayName: name } : {}),
						...(imageUrl !== undefined ? { image: imageUrl } : {}),
					})
					.where(eq(team.name, teamName)),
				err => buildCRUDError('delete', 'team', err),
			);
		},
		{
			team: ['update'],
		},
	);

export default deleteTeam;
