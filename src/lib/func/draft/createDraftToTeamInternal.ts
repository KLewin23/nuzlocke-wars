import { db, teamsToDrafts } from '@/db';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

const createDraftToTeamInternal = (draftId: number, teamNames: Array<string>): Promise<QueryState> =>
	successOr(db.insert(teamsToDrafts).values(teamNames.map(name => ({ teamName: name, draftId }))), err =>
		buildCRUDError('create', 'draft to team mapping', err),
	);

export { createDraftToTeamInternal };
