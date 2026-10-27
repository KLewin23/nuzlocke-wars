import { z } from 'zod';
import { asTRPCError } from '@/util/query';
import getTeams from '@/func/trpc/getTeams';
import { throwOnLeft } from '@/util/either';
import getDraftInfo from '@/func/trpc/getDraftInfo';
import getCurrentRound from '@/func/trpc/getCurrentRound';

import { authenticatedProcedure, createTRPCRouter } from '../init';

export const appRouter = createTRPCRouter({
	// getFullDraft: authenticatedProcedure
	// 	.input(
	// 		z.object({
	// 			draftId: z.number(),
	// 		}),
	// 	)
	// 	.query(async opts => await getFullDraft(opts.ctx.session, opts.input.draftId)),
	getDraftInfo: authenticatedProcedure
		.input(
			z.object({
				draftId: z.number(),
			}),
		)
		.query(async opts => {
			const draftInfo = await getDraftInfo(opts.ctx.session, opts.input.draftId);
			return throwOnLeft(draftInfo, asTRPCError).data;
		}),
	getTeams: authenticatedProcedure.input(z.object({ draftId: z.number() })).query(async opts => {
		const teams = await getTeams(opts.ctx.session, opts.input.draftId);
		return throwOnLeft(teams, asTRPCError).data;
	}),
	getCurrentRound: authenticatedProcedure.input(z.object({ draftId: z.number() })).query(async opts => {
		const currentRound = await getCurrentRound(opts.ctx.session, opts.input.draftId);
		return throwOnLeft(currentRound, asTRPCError).data;
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
