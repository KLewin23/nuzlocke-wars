import { contentConfig } from '@/data/content';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';
import BasicNavbar from '@/components/organisms/BasicNavbar';
import getTwitchChannel from '@/func/twitch/getTwitchChannel';

import ContentShowcase from './ContentShowcase';

const page = async () => {
	const showcaseChannel = await getTwitchChannel(contentConfig.showcaseStream.usersLoginName, true);
	prefetch(trpc.getClips.queryOptions({ cursor: 0, pageSize: 20 }));

	return (
		<HydrateClient>
			<div className="gradient-section-red-background">
				<BasicNavbar variant="content" />
				<main className="col">
					<ContentShowcase showcaseResponse={showcaseChannel} />
				</main>
			</div>
		</HydrateClient>
	);
};

export default page;
