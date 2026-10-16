import { db, teamsToDrafts } from '@/db';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

const createDraftToTeamInternal = (draftId: number, teamIds: Array<number>): Promise<QueryState> =>
	successOr(db.insert(teamsToDrafts).values(teamIds.map(id => ({ teamId: id, draftId }))), err =>
		buildCRUDError('create', 'draft to team mapping', err),
	);

export { createDraftToTeamInternal };
