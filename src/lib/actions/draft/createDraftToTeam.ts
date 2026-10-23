'use server';

import adminSession from '@/func/adminSession';
import type { QueryState } from '@/util/query';
import type { BaseTeamData } from '@/type/actions';
import { createDraftToTeamInternal } from '@/func/createDraftToTeamInternal';

const createDraftToTeamMapping = (draftId: number, teams: Array<BaseTeamData>): Promise<QueryState> =>
	adminSession(async () => createDraftToTeamInternal(draftId, teams), {
		draft: ['update'],
	});

export default createDraftToTeamMapping;
