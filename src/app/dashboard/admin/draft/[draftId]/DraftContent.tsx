'use client';

import useDraft from '@/hooks/useDraft';
import { DraftStatus } from '@/db/draftSchema';
import TargetUserImage from '@/atoms/TargetUserImage';
import DraftingTeamGrid from '@/organisms/DraftingTeamGrid';

import AdminControls from './AdminControls';

interface Props {
	draftId: number;
}

const DraftContent = ({ draftId }: Props) => {
	const [draft] = useDraft(draftId);

	return (
		<div className="col items-center gap-4 py-6">
			<div className="col items-center gap-2">
				<TargetUserImage
					targetUser={draft.currentRound?.targetPlayer}
					forceHide={draft.info?.status !== DraftStatus.active}
				/>
				<AdminControls draftId={draftId} draft={draft} />
			</div>
			<DraftingTeamGrid draft={draft} />
		</div>
	);
};

export default DraftContent;
