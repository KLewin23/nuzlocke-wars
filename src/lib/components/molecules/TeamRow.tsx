import Image from 'next/image';
import Gavel from '@/public/Gavel.png';
import Pouch from '@/public/Pouch.png';
import UserImage from '@/atoms/UserImage';
import type { TeamData } from '@/type/queries';

interface Props extends TeamData {
	teamName: string;
	initialTeamCoins?: number;
	maxPlayers: number;
	currentBid: number | null;
	shouldRevealBid: boolean;
}

const TeamRow = ({
	captain,
	players,
	teamName,
	coinsSpent,
	initialTeamCoins,
	currentBid,
	maxPlayers,
	shouldRevealBid,
}: Props) => (
	<>
		<div className="col font-ithaca items-start justify-center gap-2">
			<div className="row items-center gap-2.5 text-2xl">
				<Image alt="Money Pouch" src={Pouch} height={40} />
				{initialTeamCoins !== undefined ?
					<p>{initialTeamCoins - coinsSpent}</p>
				:	<p>??</p>}
			</div>
			<div className="row items-center gap-2.5 text-2xl">
				<Image alt="Auction Gavel" src={Gavel} height={40} />
				<p>{shouldRevealBid && currentBid !== null ? currentBid : '??'}</p>
			</div>
		</div>
		<div className="w-full items-start">
			<div className="row h-7 rounded-tl-lg">
				<div className="row h-7 min-w-70 items-end rounded-tl-lg bg-black/25 pl-4">
					<p className="font-railroad-gothic">Team {teamName}</p>
				</div>
				<div className="border-t-28 border-l-28 border-t-transparent border-l-black/25" />
			</div>
			<div className="row bg-red grow gap-4 justify-between bg-black/25 px-4 pt-4 pb-2">
				<div className="col items-center gap-1">
					<UserImage userData={captain} />
					<p className="font-railroad-gothic text-xs">{captain.username.substring(0, 15)}</p>
				</div>
				<div className="row gap-2">
					{players.map(player => (
						<div key={player.id} className="col items-center gap-1">
							<UserImage userData={player} />
							<p className="font-railroad-gothic text-xs">{player.username.substring(0, 15)}</p>
						</div>
					))}
					{Array.from(Array(Math.max(maxPlayers - 1 - players.length, 0))).map((_, index) => (
						<UserImage key={`${teamName}_Unpicked_Player_${index}`} />
					))}
				</div>
			</div>
		</div>
	</>
);

export default TeamRow;
