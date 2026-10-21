'use client';

import Ably from 'ably';
import type { ReactNode } from 'react';
import { AblyProvider as AblyInternalProvider } from 'ably/react';

interface Props {
	apiToken: string;
	userId: string;
	children: ReactNode;
}

const AblyProvider = ({ apiToken, userId, children }: Props) => {
	const realtimeClient = new Ably.Realtime({
		key: apiToken,
		clientId: userId,
	});
	return <AblyInternalProvider client={realtimeClient}>{children}</AblyInternalProvider>;
};

export default AblyProvider;
