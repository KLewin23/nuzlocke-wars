import { Info } from 'lucide-react';
import Title from '@/atoms/typography/Title';
import getClips from '@/func/serverFunctions/getClips';

import ClipTable from './ClipTable';
import ManualLoadClipForm from './ManualLoadClipForm';

const page = async () => {
	const getClipResponse = await getClips();

	return (
		<div className="col w-full max-w-250 grow gap-4 self-center overflow-hidden">
			<div className="col gap-2">
				<Title>Manually Load Clip</Title>
				<div className="row items-center gap-2">
					<Info size={23} />
					<p className="font-bold">Enter a Twitch clip url to begin.</p>
				</div>
			</div>
			<div>
				<div className="col w-full gap-2 overflow-hidden pb-4">
					<ManualLoadClipForm />
					<ClipTable getClipResponse={getClipResponse} />
				</div>
			</div>
		</div>
	);
};

export default page;
