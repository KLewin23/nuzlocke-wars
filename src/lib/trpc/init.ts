import SuperJSON from 'superjson';
import { auth } from '@/auth/auth';
import { TRPCError, initTRPC } from '@trpc/server';

/**
 * This context creator accepts `headers` so it can be reused in both
 * the RSC server caller (where you pass `next/headers`) and the
 * API route handler (where you pass the request headers).
 */
 const createTRPCContext = async ({ headers }: { headers: Headers }) => {
	const session = await auth.api.getSession({
		headers,
	});

	return { session };
};
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create({
	/**
	 * @see https://trpc.io/docs/server/data-transformers
	 */
	transformer: SuperJSON,
});
// Base router and procedure helpers
const createTRPCRouter = t.router;
const createCallerFactory = t.createCallerFactory;
const authenticatedProcedure = t.procedure.use(async opts => {
	const { ctx } = opts;
	if (!ctx.session?.user) throw new TRPCError({ code: 'UNAUTHORIZED' });

	return opts.next({
		ctx: {
            session: ctx.session
        },
	});
});

export { createTRPCContext, createTRPCRouter, createCallerFactory, authenticatedProcedure };
