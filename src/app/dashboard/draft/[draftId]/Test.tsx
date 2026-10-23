'use client';

import type { Message } from 'ably';
import { useChannel } from 'ably/react';
import React, { useState } from 'react';

interface Props {
	draftId: number;
}

const Test = ({draftId}: Props) => {
	const [messages, setMessages] = useState<Array<Message>>([]);

	console.log(messages);
	useChannel(`local:${draftId}`, message => {
		setMessages(prevMessages => [...prevMessages, message]);
	});
	return (
		<div>
			<p>component</p>
		</div>
	);
};

export default Test;
