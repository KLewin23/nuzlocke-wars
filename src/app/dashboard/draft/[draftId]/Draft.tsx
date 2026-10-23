'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { ChannelProvider } from 'ably/react';
import type { GetFullDraft } from '@/type/queries';

import Test from './Test';

const AblyProvider = dynamic(() => import('./AblyProvider'), {
	ssr: false, //NOTE -- Ensures that server side rendering is never used for this component
});

interface Props {
	userId: string;
	draftId: number;
	fullDraft: GetFullDraft;
}

const Draft = ({ draftId, userId, fullDraft }: Props) => {
	const [draft, setDraft] = useState(fullDraft);

	return (
		<AblyProvider userId={userId} draftId={draftId}>
			<ChannelProvider channelName={`local:${draftId}`}>
				<div className="col items-center gap-8">
					<p>{draftId}</p>
					{userId}
					<Test draftId={draftId} />
				</div>
			</ChannelProvider>
		</AblyProvider>
	);
};

export default Draft;
