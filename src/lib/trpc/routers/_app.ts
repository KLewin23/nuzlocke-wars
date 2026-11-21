import { z } from 'zod';
import { asTRPCError } from '@/util/query';
import getClips from '@/func/trpc/getClips';
import getTeams from '@/func/trpc/getTeams';
import { throwOnLeft } from '@/util/either';
import getDraftInfo from '@/func/trpc/getDraftInfo';
import getCurrentRound from '@/func/trpc/getCurrentRound';

import { authenticatedProcedure, createTRPCRouter, unauthenticatedProcedure } from '../init';

export const appRouter = createTRPCRouter({
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
	getClips: unauthenticatedProcedure.input(z.object({ pageSize: z.number(), cursor: z.number() })).query(async opts => {
		const clips = await getClips(opts.input.pageSize, opts.input.cursor);
		return throwOnLeft(clips, asTRPCError).data;
	}),
});

// export type definition of API
export type AppRouter = typeof appRouter;
