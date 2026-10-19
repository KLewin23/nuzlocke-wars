'use server';

import { eq } from 'drizzle-orm';
import { leftOf } from '@/util/either';
import buildCRUDError from '@/error/crudError';
import adminSession from '@/func/adminSession';
import { type DraftStatus, db, draft } from '@/db';
import { type QueryState, successOr } from '@/util/query';

interface CreateDraftPayload {
	name?: string;
	roundLength?: number;
	initialPlayerCoins?: number;
	status?: DraftStatus;
}

const updateDraft = async (
	draftId: number,
	{ name, initialPlayerCoins, roundLength, status }: CreateDraftPayload,
): Promise<QueryState> =>
	adminSession(
		async () => {
			if (
				name === undefined &&
				roundLength === undefined &&
				initialPlayerCoins === undefined &&
				status === undefined
			)
				return leftOf({
					type: 'BadRequest' as const,
					cause: 'All of [name, roundLength, initialPlayerCoins, status] where undefined.',
				});

			return successOr(
				db
					.update(draft)
					.set({
						...(name !== undefined ? { name } : {}),
						...(roundLength !== undefined ? { roundLength } : {}),
						...(initialPlayerCoins !== undefined ? { initialPlayerCoins } : {}),
						...(status !== undefined ? { status } : {}),
					})
					.where(eq(draft.id, draftId)),
				err => buildCRUDError('update', 'draft', err),
			);
		},
		{
			draft: ['update'],
		},
	);

export default updateDraft;
