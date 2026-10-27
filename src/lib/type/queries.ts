import type { DraftStatus, RoundStatus } from '@/db';

type GetCurrentCaptainSpend = Array<{
	coinsSpent: number | null;
	teamName: string;
}>;

interface DraftInfo {
	name: string;
	status: DraftStatus;
	roundLength: number;
	initialPlayerCoins: number;
	maxPlayersPerTeam: number;
	roundStatus: RoundStatus;
}

type TargetUser = Omit<UserData, 'id'> | null;

interface UserData {
	username: string;
	image: string | null;
	id: string;
}

interface TeamData {
	captain: UserData;
	players: Array<UserData>;
	coinsSpent: number;
	// latestBid: number | null
}

// Key = team name
type GetTeams = Record<string, TeamData>;

interface Bid {
	id: number
	teamName: string;
	amount: number;
	captainId: string;
}

interface GetCurrentRound {
	biddingStartTime: Date | null;
	roundLength: number;
	targetPlayer: UserData | null;
	roundStatus: RoundStatus;
	bids: Array<Bid>;
}

interface GetFullDraft {
	// captainSpend: GetCurrentCaptainSpend;
	info?: DraftInfo;
	teams?: GetTeams;
	currentRound?: GetCurrentRound;
}

export type {
	GetCurrentCaptainSpend,
	GetFullDraft,
	GetTeams,
	GetCurrentRound,
	TargetUser,
	TeamData,
	UserData,
	DraftInfo,
};
