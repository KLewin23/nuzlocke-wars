import { db, usersToDrafts } from '@/db';
import type { PlayerList } from '@/type/actions';
import buildCRUDError from '@/error/crudError';
import { type QueryState, successOr } from '@/util/query';

const createDraftToPlayersInternal = (draftId: number, players: PlayerList): Promise<QueryState> =>
	successOr(
		db.insert(usersToDrafts).values(
			players.map(player => ({
				userId: player.userId,
				draftId: draftId,
				teamId: player.teamId,
				teamRole: player.teamRole,
			})),
		),
		err => buildCRUDError('create', 'draft to players mapping', err),
	);

export { createDraftToPlayersInternal };
