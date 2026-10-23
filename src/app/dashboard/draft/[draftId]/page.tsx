import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import getFullDraft from '@/func/trpc/getFullDraft';

import Draft from './Draft';

const page = async ({ params }: { params: Promise<{ draftId: number }> }) => {
	const { draftId } = await params;
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const userId = session?.user.id;

	if (!userId) return redirect(`/dashboard/drafts?errorType=Unauthorized`);

	const fullDraft = await getFullDraft(session, draftId);
	
	if (fullDraft._type === 'left') return redirect(`/dashboard/drafts?errorType=Forbidden`);

	return <Draft userId={userId} draftId={draftId} fullDraft={fullDraft.value.data} />;
};

export default page;
