'use server';
import * as Ably from 'ably';
import { env } from '@/env/server';

type AblyEvent = "DraftStarted" | "NextRoundStarted" | "BiddingStarted" | "BiddingEnded" | "DraftEnded" | "BidSubmitted" | "BidRetracted"

const ablyPublishClient = new Ably.Rest(env.ABLY_PUBLISH_API_KEY);

const publishEvent = async (draftId: number, event: AblyEvent) => {
    const channel = ablyPublishClient.channels.get(`${env.VERCEL_ENV}:${draftId}`)
    return channel.publish(event, undefined)
}


export {type AblyEvent, publishEvent}
