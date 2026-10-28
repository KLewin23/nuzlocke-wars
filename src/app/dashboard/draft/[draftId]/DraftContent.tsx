'use client';

import cn from 'cnfast';
import useDraft from '@/hooks/useDraft';
import { DraftStatus } from '@/db/draftSchema';
import TargetUserImage from '@/atoms/TargetUserImage';
import DraftingTeamGrid from '@/organisms/DraftingTeamGrid';

import UserControls from './UserControls';

// import AdminControls from './AdminControls';

interface Props {
	draftId: number;
}

const DraftContent = ({ draftId }: Props) => {
	const [draft] = useDraft(draftId);

	return (
		<div className={cn("col h-full items-center gap-4 py-6", draft.info?.status === DraftStatus.complete ? 'justify-center' : '')}>
			{draft.info?.status !== DraftStatus.complete ?
				<div className={'col items-center gap-2'}>
					<TargetUserImage
						targetUser={draft.currentRound?.targetPlayer}
						forceHide={draft.info?.status !== DraftStatus.active}
					/>
					<UserControls draftId={draftId} draft={draft} />
				</div>
			:	null}
			<DraftingTeamGrid draft={draft} />
		</div>
	);
};

export default DraftContent;
