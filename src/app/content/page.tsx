import { contentConfig } from '@/data/content';
import BasicNavbar from '@/components/organisms/BasicNavbar';
import getTwitchChannel from '@/func/twitch/getTwitchChannel';

import ContentShowcase from './ContentShowcase';

const page = async () => {
	const showcaseChannel = await getTwitchChannel(contentConfig.showcaseStream.usersLoginName, true);

	return (
		<div className="gradient-section-red-background">
			<BasicNavbar variant="content" />
			<main className="col">
				<ContentShowcase showcaseResponse={showcaseChannel} />
			</main>
		</div>
	);
};

export default page;
