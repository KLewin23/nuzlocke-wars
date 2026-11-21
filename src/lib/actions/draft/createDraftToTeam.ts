'use server';

import withAdminSession from '@/func/withAdminSession';
import type { QueryState } from '@/util/query';
import type { BaseTeamData } from '@/type/actions';
import { createDraftToTeamInternal } from '@/func/createDraftToTeamInternal';

const createDraftToTeamMapping = (draftId: number, teams: Array<BaseTeamData>): Promise<QueryState> =>
	withAdminSession(async () => createDraftToTeamInternal(draftId, teams), {
		draft: ['update'],
	});

export default createDraftToTeamMapping;
