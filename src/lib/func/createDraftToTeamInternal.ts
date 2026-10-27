import { db, teamsToDrafts } from '@/db';
import type { BaseTeamData } from '@/type/actions';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

const createDraftToTeamInternal = (draftId: number, teams: Array<BaseTeamData>): Promise<QueryState> =>
	successOr(
		db
			.insert(teamsToDrafts)
			.values(teams.map(team => ({ teamName: team.name, draftId, captainId: team.captainId }))),
		err => buildCRUDError('create', 'draft to team mapping', err),
	);

export { createDraftToTeamInternal };
