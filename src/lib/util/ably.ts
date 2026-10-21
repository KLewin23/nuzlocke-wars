'use server';
import * as Ably from 'ably';
import { env } from '@/env/server';

type AblyEvent =
	| 'DraftStarted'
	| 'NextRoundStarted'
	| 'BiddingStarted'
	| 'BiddingEnded'
	| 'DraftEnded'
	| 'BidSubmitted'
	| 'BidRetracted';

const ablyPublishClient = new Ably.Rest(env.ABLY_PUBLISH_API_KEY);

const draftChannel = (draftId: number) => ablyPublishClient.channels.get(`${env.VERCEL_ENV}:${draftId}`);

const publishEvent = async (draftId: number, event: AblyEvent) => {
	const channel = draftChannel(draftId);
	return channel.publish(event, undefined);
};

export { type AblyEvent, publishEvent, draftChannel };
