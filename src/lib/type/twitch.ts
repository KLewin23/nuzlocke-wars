import type { TClipStatus } from '@/db/contentSchema';

interface TwitchClip {
	id: number;
	title: string;
	url: string;
	status: TClipStatus;
	creatorId?: string;
	creatorName: string | null;
	thumbnailUrl: string;
	broadcasterId: string;
	broadcasterName: string;
}

type DisplayTwitchClip =  Omit<TwitchClip, 'creatorId' | 'broadcasterId'>;
type BareTwitchClip = Omit<TwitchClip, 'url' | 'creatorId' | 'broadcasterId' | 'thumbnailUrl'>;

export type { BareTwitchClip, TwitchClip, DisplayTwitchClip };
