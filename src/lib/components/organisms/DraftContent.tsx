import cn from 'cnfast';
import React from 'react';
import useDraft from '@/hooks/useDraft';
import { DraftStatus } from '@/db/draftSchema';
import type { GetFullDraft } from '@/type/queries';

import DraftingTeamGrid from './DraftingTeamGrid';
import TargetUserImage from '../atoms/TargetUserImage';

interface ControlsProps {
	draftId: number;
	draft: GetFullDraft;
}

interface Props {
	draftId: number;
	controls: React.FC<ControlsProps>;
}

const DraftContent = ({ draftId, controls: Controls }: Props) => {
	const [draft] = useDraft(draftId);

	return (
		<div
			className={cn(
				'col h-full items-center gap-4 py-6',
				draft.info?.status === DraftStatus.complete ? 'justify-center' : '',
			)}
		>
			{draft.info?.status !== DraftStatus.complete ?
				<div className={'col items-center gap-2'}>
					<TargetUserImage
						targetUser={draft.currentRound?.targetPlayer}
						forceHide={draft.info?.status !== DraftStatus.active}
					/>
					<Controls draftId={draftId} draft={draft} />
				</div>
			:	<h1 className={'font-railroad-gothic text-6xl'}>Your Teams</h1>}

			<DraftingTeamGrid draft={draft} />
		</div>
	);
};

export default DraftContent;
