'use server';

import adminSession from '@/func/adminSession';
import type { QueryState } from '@/util/query';
import { createDraftToTeamInternal } from '@/func/draft/createDraftToTeamInternal';

const createDraftToTeamMapping = (draftId: number, teamIds: Array<string>): Promise<QueryState> =>
	adminSession(async () => createDraftToTeamInternal(draftId, teamIds), {
		draft: ['update'],
	});

export default createDraftToTeamMapping;
