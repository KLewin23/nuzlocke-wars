'use client';

import Ably from 'ably';
import { type ReactNode } from 'react';
import { AblyProvider as AblyInternalProvider } from 'ably/react';

interface Props {
	userId: string;
	draftId: number;
	children: ReactNode;
}

const AblyProvider = ({ userId, draftId, children }: Props) => {
	const realtimeClient = new Ably.Realtime({
		clientId: userId,
		authUrl: '/ably',
		authMethod: 'POST',
		authParams: {
			draftId: draftId.toString(),
		},
		
	});
	return <AblyInternalProvider client={realtimeClient}>{children}</AblyInternalProvider>;
};

export default AblyProvider;
