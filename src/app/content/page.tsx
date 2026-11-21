import { contentConfig } from '@/data/content';
import BasicNavbar from '@/components/organisms/BasicNavbar';
import getTwitchChannel from '@/func/twitch/getTwitchChannel';
import { HydrateClient, prefetch, trpc } from '@/trpc/server';

import ContentShowcase from './ContentShowcase';

const page = async () => {
	prefetch(trpc.getClips.queryOptions({ cursor: 0, pageSize: 20 }));
	const showcaseChannel = await getTwitchChannel(contentConfig.showcaseStream.usersLoginName, true);

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
