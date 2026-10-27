'use client';

import useDraft from '@/hooks/useDraft';
import { entries } from '@/util/extension';
import TeamRow from '@/components/molecules/TeamRow';
import TargetUserImage from '@/atoms/TargetUserImage';
import { DraftStatus, RoundStatus } from '@/db/draftSchema';

import UserControls from './UserControls';

// import AdminControls from './AdminControls';

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
				<UserControls draftId={draftId} draft={draft} />
			</div>
			{entries(draft?.teams ?? {}).map(([teamName, team]) => {
				const currentBid = draft.currentRound?.bids.find(b => b.teamName === teamName);
				return (
					<TeamRow
						key={teamName}
						captain={team.captain}
						coinsSpent={team.coinsSpent}
						currentBid={currentBid !== undefined ? currentBid.amount : null}
						initialTeamCoins={draft.info?.initialPlayerCoins}
						maxPlayers={draft.info?.maxPlayersPerTeam ?? 0}
						players={team.players}
						teamName={teamName}
						shouldRevealBid={draft.currentRound?.roundStatus === RoundStatus.post_bidding}
					/>
				);
			})}
		</div>
	);
};

export default DraftContent;
