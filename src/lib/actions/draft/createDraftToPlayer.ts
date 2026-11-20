'use server';

import withAdminSession from '@/func/withAdminSession';
import type { QueryState } from '@/util/query';
import type { PlayerList } from '@/type/actions';
import { createDraftToPlayersInternal } from '@/func/createDraftToPlayerInternal';

const createDraftToPlayers = (draftId: number, players: PlayerList): Promise<QueryState> =>
	withAdminSession(async () => createDraftToPlayersInternal(draftId, players), {
		draft: ['update'],
	});

export default createDraftToPlayers;
