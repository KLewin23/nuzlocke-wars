'use client';

import Ably from 'ably';
import { type ReactNode } from 'react';
import { AblyProvider as AblyInternalProvider } from 'ably/react';

interface Props {
	userId: string;
	draftId: number;
	children: ReactNode;
	mode?: 'admin' | 'basic'
}

const AblyProvider = ({ userId, draftId, children, mode = 'basic' }: Props) => {
	const realtimeClient = new Ably.Realtime({
		clientId: userId,
		authUrl: mode === 'basic' ? '/api/ably' : '/api/ably/admin',
		authMethod: 'POST',
		authParams: {
			draftId: draftId.toString(),
		}
	});

	return <AblyInternalProvider client={realtimeClient}>{children}</AblyInternalProvider>;
};

export default AblyProvider;
