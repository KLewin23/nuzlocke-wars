'use client';

import { TwitchPlayer } from 'react-twitch-embed';
import type { QueryStateWithNonFailure, Success } from '@/util/query';
import type { SingularTwitchChannel } from '@/func/twitch/getTwitchChannel';

import ClipsTable from './ClipsTable';

interface Props {
	showcaseResponse: QueryStateWithNonFailure<Success<SingularTwitchChannel>>;
}

const ContentShowcase = ({ showcaseResponse }: Props) => (
	<div className="col w-full items-center gap-14 py-8">
		{showcaseResponse._type === 'right' ?
			<div className="col items-center gap-6">
				<h1 className="xs:text-5xl font-railroad-gothic text-xl sm:text-4xl md:text-8xl">Live Now</h1>
				<TwitchPlayer channel={showcaseResponse.value.data.usersLoginName} autoplay muted />
			</div>
		:	null}
		<ClipsTable />
	</div>
);

export default ContentShowcase;
