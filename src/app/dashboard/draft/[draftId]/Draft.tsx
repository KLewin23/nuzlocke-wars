'use client';

import dynamic from 'next/dynamic';
import { clientEnv } from '@/env/client';
import { ChannelProvider } from 'ably/react';
import DraftContent from '@/organisms/DraftContent';

import UserControls from './UserControls';

// import DraftContent from './DraftContent';

const AblyProvider = dynamic(() => import('../../../../lib/components/atoms/AblyProvider'), {
	ssr: false, //NOTE -- Ensures that server side rendering is never used for this component
});

interface Props {
	userId: string;
	draftId: number;
}

const Draft = ({ draftId, userId }: Props) => (
	<AblyProvider userId={userId} draftId={draftId} mode="basic">
		<ChannelProvider channelName={`${clientEnv.NEXT_PUBLIC_VERCEL_ENV}:${draftId}`}>
			<DraftContent draftId={draftId} controls={UserControls} />
		</ChannelProvider>
	</AblyProvider>
);

export default Draft;
