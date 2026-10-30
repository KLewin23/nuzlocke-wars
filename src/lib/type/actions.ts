import type { Role } from '@/db';

import type { DraftStatus } from '../db/draftSchema';

interface BaseTeamData {
	name: string;
	captainId: string;
}

interface Team extends BaseTeamData {
	isNew: boolean;
}

interface Player {
	userId: string;
	teamName?: string;
}

interface DraftResponse {
	id: number;
	name: string;
	status: DraftStatus;
	maxmimumPlayersPerTeam: number;
	teamsCount: number
}

interface UserResponse {
	id: string;
	username: string;
	role: Role;
	createdAt: Date;
	userSessionsCount: number;
}

type DraftResponseList = Array<DraftResponse>;
type UserResponseList = Array<UserResponse>;
type PlayerList = Array<Player>;

interface CreateUserPayload {
	username: string;
	role: Role;
	password?: string;
	imageUrl?: string;
}

export type { PlayerList, DraftResponseList, UserResponseList, CreateUserPayload, Team, BaseTeamData };
