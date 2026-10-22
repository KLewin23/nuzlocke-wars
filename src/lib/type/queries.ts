import { DraftStatus, RoundStatus } from '@/db';

type GetCurrentCaptainSpend = Array<{
	coinsSpent: number | null;
	captainId: string;
}>;

interface DraftResponse {
	name: string;
	status: DraftStatus;
	roundLength: number;
	initialPlayerCoins: number;
	maxPlayersPerTeam: number;
	roundStatus: RoundStatus;
	biddingStartTime: Date | null;
	targetUser: {
		username: string;
		image: string | null;
	} | null;
}

interface UserData {
	username: string;
	image: string | null;
	id: string
}

// Key = team name
type GetTeams = Record<
	string,
	{
		captain: UserData;
		players: Array<UserData>;
	}
>;

interface GetFullDraft extends DraftResponse {
	captainSpend: GetCurrentCaptainSpend;
	teams: GetTeams;
}

export type { GetCurrentCaptainSpend, GetFullDraft, GetTeams };
