

import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import Draft from './Draft';

const page = async ({ params }: { params: Promise<{ draftId: number }> }) => {
	const { draftId } = await params;
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const userId = session?.user.id;

	if (!userId) return redirect(`/dashboard/drafts?errorType=Unauthorized`);

	return <Draft userId={userId} draftId={draftId} />;
};

export default page;
