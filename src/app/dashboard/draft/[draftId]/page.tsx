import z from 'zod';
import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import hasDraftAccess from '@/func/serverFunctions/hasDraftAccess';

import Draft from './Draft';

const page = async ({ params }: { params: Promise<{ draftId: number }> }) => {
	const { draftId } = await params;
	const parsedDraftId = z.coerce.number().safeParse(draftId);
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const userId = session?.user.id;

	if (!parsedDraftId.success) return redirect(`/dashboard/drafts?errorType=BadRequest`);
	if (!userId) return redirect(`/dashboard/drafts?errorType=Unauthorized`);

	if ((await hasDraftAccess(parsedDraftId.data))._type === 'left')
		return redirect(`/dashboard/drafts?errorType=Forbidden`);

	prefetch(trpc.getCurrentRound.queryOptions({ draftId: parsedDraftId.data }));
	prefetch(trpc.getTeams.queryOptions({ draftId: parsedDraftId.data }));
	prefetch(trpc.getDraftInfo.queryOptions({ draftId: parsedDraftId.data }));

	return (
		<HydrateClient>
			<Draft userId={userId} draftId={parsedDraftId.data} />
		</HydrateClient>
	);
};

export default page;
