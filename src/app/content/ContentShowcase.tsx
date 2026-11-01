'use client';

import { TwitchPlayer } from 'react-twitch-embed';
import type { QueryStateWithNonFailure, Success } from '@/util/query';
import type { SingularTwitchChannel } from '@/func/twitch/getTwitchChannel';

interface Props {
	showcaseResponse: QueryStateWithNonFailure<Success<SingularTwitchChannel>>;
}

const ContentShowcase = ({ showcaseResponse }: Props) => (
	<div className="col h-[calc(100vh-76px)] w-full items-center gap-14 pt-8">
		{showcaseResponse._type === 'right' ?
			<div className="col items-center gap-6">
				<h1 className="xs:text-5xl font-railroad-gothic text-xl sm:text-4xl md:text-8xl">Live Now</h1>
				<TwitchPlayer channel={showcaseResponse.value.data.usersLoginName} autoplay muted />
			</div>
		:	null}
		<h2 className="xs:text-5xl font-railroad-gothic text-xl sm:text-4xl md:text-6xl">Highlights, Coming Soon!</h2>
	</div>
);

export default ContentShowcase;
