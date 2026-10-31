'use client';

import { match } from 'ts-pattern';
import Button from '@/atoms/Button';
import { addSeconds } from 'date-fns';
import { useTransition } from 'react';
import Countdown from 'react-countdown';
import handleAction from '@/util/actions';
import type { GetFullDraft } from '@/type/queries';
import startDraft from '@/actions/draft/startDraft';
import startBidding from '@/actions/draft/startBidding';
import { DraftStatus, RoundStatus } from '@/db/draftSchema';
import checkIfBiddingOver from '@/actions/draft/checkIfBiddingOver';
import CountdownRenderer from '@/components/atoms/CountdownRenderer';

import AfterBiddingControls from './AfterBiddingControls';

interface Props {
	draftId: number;
	draft: GetFullDraft;
}

const AdminControls = ({ draftId, draft }: Props) => {
	const [isPending, startTransition] = useTransition();
	const runAction = handleAction(startTransition);

	const checkBiddingComplete = () => {
		runAction(checkIfBiddingOver(draftId), ({ data: { isComplete } }) => {
			if (!isComplete) setTimeout(checkBiddingComplete, 2000);

			return {
				title: 'Bid Status Check Complete',
				description: isComplete ? `Bidding is complete, players have been told` : `Bidding is not yet complete`,
			};
		});
	};

	const mainAction = match([draft.info?.status, draft.currentRound?.roundStatus])
		.with([DraftStatus.open, RoundStatus.pre_bidding], () => (
			<Button
				palette="green"
				className="3xl:text-xl w-40 text-lg max-h-11"
				disabled={isPending}
				onClick={() =>
					runAction(startDraft(draftId), () => ({
						title: 'Draft Started',
						description: 'Draft was started successfully, and players have been told.',
					}))
				}
			>
				Start Draft
			</Button>
		))
		.with([DraftStatus.active, RoundStatus.pre_bidding], () => (
			<Button
				palette="green"
				className="3xl:text-xl w-40 text-lg max-h-11"
				disabled={isPending}
				onClick={() =>
					runAction(startBidding(draftId), () => ({
						title: 'Bidding Started',
						description: 'Bigging was started successfully, and players have been told.',
					}))
				}
			>
				Start Bidding
			</Button>
		))
		.with([DraftStatus.active, RoundStatus.bidding], () =>
			draft.currentRound?.biddingStartTime && draft.info ?
				<div className="row items-center gap-2">
					<p className="font-railroad-gothic text-lg">Bidding closes in:</p>
					<Countdown
						onComplete={checkBiddingComplete}
						date={addSeconds(draft.currentRound.biddingStartTime, draft.info?.roundLength)}
						renderer={p => <CountdownRenderer {...p} completedMessage="Bidding Is Closed" />}
					/>
				</div>
			:	null,
		)
		.with([DraftStatus.active, RoundStatus.post_bidding], () => <AfterBiddingControls draftId={draftId} />)
		.otherwise(() => null);

	return <>{mainAction}</>;
};

export default AdminControls;
