import TeamRow from '@/molecules/TeamRow';
import { entries } from '@/util/extension';
import { RoundStatus } from '@/db/draftSchema';
import type { GetFullDraft } from '@/type/queries';

interface Props {
	draft: GetFullDraft;
}

const DraftingTeamGrid = ({ draft }: Props) => (
	<div className="grid grid-cols-[auto_1fr] gap-4">
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

export default DraftingTeamGrid;
