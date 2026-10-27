import { and, eq } from 'drizzle-orm';
import { type Either } from '@/util/either';
import withSession from '@/func/withSession';
import buildCRUDError from '@/error/crudError';
import { db, playersToDrafts } from '@/db';
import { type QueryFailureState, type Success, successOr } from '@/util/query';

const hasDraftAccess = async (draftId: number): Promise<Either<QueryFailureState, Success<{ hasAccess: boolean }>>> =>
	withSession(async session =>
		successOr(
			db
				.select({
					draftId: playersToDrafts.draftId,
				})
				.from(playersToDrafts)
				.where(and(eq(playersToDrafts.userId, session.user.id), eq(playersToDrafts.draftId, draftId)))
				.then(r => ({
					hasAccess: r.length > 0,
				})),
			err => buildCRUDError('read', 'drafts', err),
			false,
		),
	);

export default hasDraftAccess;
