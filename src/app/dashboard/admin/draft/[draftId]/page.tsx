import z from 'zod';
import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

import Draft from './Draft';

const page = async ({ params }: { params: Promise<{ draftId: string }> }) => {
	const { draftId } = await params;
	const parsedDraftId = z.coerce.number().safeParse(draftId);
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const userId = session?.user.id;

	if (!parsedDraftId.success) return redirect(`/dashboard/drafts?errorType=BadRequest`);
	if (!userId || session.user.role !== 'admin') return redirect(`/dashboard/drafts?errorType=Unauthorized`);

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
