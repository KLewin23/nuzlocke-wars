'use client';

import dynamic from 'next/dynamic';
import { ChannelProvider } from 'ably/react';

import DraftContent from './DraftContent';

const AblyProvider = dynamic(() => import('../../../../lib/components/atoms/AblyProvider'), {
	ssr: false, //NOTE -- Ensures that server side rendering is never used for this component
});

interface Props {
	userId: string;
	draftId: number;
}

const Draft = ({ draftId, userId }: Props) => (
	<AblyProvider userId={userId} draftId={draftId} mode="basic">
		<ChannelProvider channelName={`local:${draftId}`}>
			<DraftContent draftId={draftId} />
		</ChannelProvider>
	</AblyProvider>
);

export default Draft;
