import 'server-only';
// <-- ensure this file cannot be imported from the client
import { cache } from 'react';
import { headers } from 'next/headers';
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { HydrationBoundary, dehydrate } from '@tanstack/react-query';
import type { ResolverDef, TRPCQueryOptions } from '@trpc/tanstack-react-query';

import { createTRPCContext } from './init';
import { appRouter } from './routers/_app';
import makeQueryClient from './queryClient';

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
const getQueryClient = cache(makeQueryClient);
const trpc = createTRPCOptionsProxy({
	ctx: async () =>
		createTRPCContext({
			headers: await headers(),
		}),
	router: appRouter,
	queryClient: getQueryClient,
});

export const HydrateClient = (props: { children: React.ReactNode }) => {
	const queryClient = getQueryClient();
	return <HydrationBoundary state={dehydrate(queryClient)}>{props.children}</HydrationBoundary>;
};
export const prefetch = <T extends ReturnType<TRPCQueryOptions<ResolverDef>>>(queryOptions: T) => {
	const queryClient = getQueryClient();

	void queryClient.query(queryOptions);
};

export { trpc, getQueryClient };
