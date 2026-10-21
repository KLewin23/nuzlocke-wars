import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import { AblyProvider } from 'ably/react';
import userGetDraftSubscribeToken from '@/func/ably/userGetDraftSubscribeToken';
import { redirect } from 'next/navigation';

const page = async ({ params }: { params: Promise<{ draftId: number }> }) => {
	const { draftId } = await params;
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	const userId = session?.user.id
	const ablyTokenResponse = await userGetDraftSubscribeToken(draftId);

	if (ablyTokenResponse._type === 'left')
		return redirect(`/dashboard/drafts?errorType=${ablyTokenResponse.value.type}`)

	if (!userId)
		return redirect(`/dashboard/drafts?errorType=Unauthorized`)



	return (
		<AblyProvider client={realtimeClient}>
			<div className="col gap-8 items-center">
				<p>{draftId}</p>
			</div>
		</AblyProvider>
	);
};

export default page;
