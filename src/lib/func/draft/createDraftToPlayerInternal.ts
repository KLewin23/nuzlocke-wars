import { successOr } from '@/util/query';
import { db, usersToDrafts } from '@/db';
import buildCRUDError from '@/error/crudError';
import type { PlayerList } from '@/type/actions';
import type { QueryFailureState, QueryState, Success } from '@/util/query';

const createDraftToPlayersInternal = (
	draftId: number,
	players: PlayerList,
): Promise<QueryState<QueryFailureState, Success>> =>
	successOr(
		db.insert(usersToDrafts).values(
			players.map(player => ({
				userId: player.userId,
				draftId: draftId,
				teamName: player.teamName,
				teamRole: player.teamRole,
			})),
		),
		err => buildCRUDError('create', 'draft to players mapping', err),
	);

export { createDraftToPlayersInternal };
