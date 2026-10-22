'use client';

import dynamic from 'next/dynamic';

const AblyProvider = dynamic(() => import('./AblyProvider'), {
	ssr: false, //NOTE -- Ensures that server side rendering is never used for this component
});

interface Props {
	userId: string;
	draftId: number;
}

const Draft = ({ draftId, userId }: Props) => {
	return (
		<AblyProvider userId={userId} draftId={draftId}>
			<div className="col items-center gap-8">
				<p>{draftId}</p>
				{userId}
			</div>
		</AblyProvider>
	);
};

export default Draft;
