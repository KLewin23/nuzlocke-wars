import z from 'zod';

const ablyEvent = z.union([
	z.literal('DraftStarted'),
	z.literal('NextRoundStarted'),
	z.literal('BiddingToBeReplayed'),
	z.literal('BiddingStarted'),
	z.literal('BiddingEnded'),
	z.literal('BidSubmitted'),
	z.literal('BidRetracted'),
	z.literal('DraftEnded'),
]);

type AblyEvent = z.infer<typeof ablyEvent>;

export { ablyEvent };
export type { AblyEvent };
