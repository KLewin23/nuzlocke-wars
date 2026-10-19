import type { Role } from '@/db';

import type { DraftStatus, TeamRole } from '../db/draftSchema';

interface Player {
	userId: string;
	teamId?: number;
	teamRole: TeamRole;
}

interface DraftResponse {
	id: number;
	name: string;
	status: DraftStatus;
	playerCount: number;
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

export type { PlayerList, DraftResponseList, UserResponseList, CreateUserPayload };
