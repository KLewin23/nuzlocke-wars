import { z } from 'zod';
import getTeams from '@/func/trpc/getTeams';
import getFullDraft from '@/func/trpc/getFullDraft';
import getCurrentRound from '@/func/trpc/getCurrentRound';

import { authenticatedProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
	getFullDraft: authenticatedProcedure
		.input(
			z.object({
				draftId: z.number(),
			}),
		)
		.query(async opts => await getFullDraft(opts.ctx.session, opts.input.draftId)),
	getTeams: authenticatedProcedure
		.input(z.object({ draftId: z.number() }))
		.query(async opts => await getTeams(opts.ctx.session, opts.input.draftId)),
	getCurrentRound: authenticatedProcedure
		.input(z.object({ draftId: z.number() }))
		.query(async opts => await getCurrentRound(opts.ctx.session, opts.input.draftId)),
});

// export type definition of API
export type AppRouter = typeof appRouter;
