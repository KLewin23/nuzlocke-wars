import { toast } from 'sonner';
import { match } from 'ts-pattern';
import { useTRPC } from '@/trpc/client';
import { ablyEvent } from '@/type/ably';
import { useChannel } from 'ably/react';
import { useQuery } from '@tanstack/react-query';
import type { GetFullDraft } from '@/type/queries';

const useDraft = (draftId: number) => {
	const trpc = useTRPC();

	const getDraftInfo = useQuery(trpc.getDraftInfo.queryOptions({ draftId }));
	const getCurrentRound = useQuery(trpc.getCurrentRound.queryOptions({ draftId }));
	const getTeams = useQuery(trpc.getTeams.queryOptions({ draftId }));

	const handleMessage = async (rawMesage?: string) => {
		const parseMessage = ablyEvent.safeParse(rawMesage);
		if (!parseMessage.success)
			return toast.error('Event Server Error', {
				description: `An event was received from the event server that was not expected`,
			});
		const message = parseMessage.data;

		await match(message)
			.with('DraftStarted', async () => getDraftInfo.refetch())
			.with('BidRetracted', () => getCurrentRound.refetch())
			.with('BiddingToBeReplayed', () => getCurrentRound.refetch())
			.with('BidSubmitted', () => getCurrentRound.refetch())
			.with('BiddingEnded', () => getCurrentRound.refetch())
			.with('NextRoundStarted', async () => {
				await getTeams.refetch();
				await getCurrentRound.refetch();
			})
			.with('BiddingStarted', () => getCurrentRound.refetch())
			.with('DraftEnded', () => getDraftInfo.refetch())
			.exhaustive();
	};

	useChannel(`local:${draftId}`, m => void handleMessage(m.name));

	const draft: GetFullDraft = {
		info: getDraftInfo.data,
		currentRound: getCurrentRound.data,
		teams: getTeams.data,
	};

	return [draft];
};

export default useDraft;
