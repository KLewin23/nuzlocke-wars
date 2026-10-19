'use server';

import adminSession from '@/func/adminSession';
import type { QueryState } from '@/util/query';
import type { PlayerList } from '@/type/actions';
import { createDraftToPlayersInternal } from '@/func/draft/createDraftToPlayerInternal';

const createDraftToPlayers = (draftId: number, players: PlayerList): Promise<QueryState> =>
	adminSession(async () => createDraftToPlayersInternal(draftId, players), {
		draft: ['update'],
	});

export default createDraftToPlayers;
