'use client';

import { match } from 'ts-pattern';
import type { GetFullDraft } from '@/type/queries';
import { DraftStatus, RoundStatus } from '@/db/draftSchema';

import BiddingControls from './BiddingControls';

interface Props {
	draftId: number;
	draft: GetFullDraft;
}

const UserControls = ({ draftId, draft }: Props) => {
	const mainAction = match([draft.info?.status, draft.currentRound?.roundStatus])
		.with([DraftStatus.open, RoundStatus.pre_bidding], () => (
			<p className="font-railroad-gothic text-lg">Waiting for the draft to start....</p>
		))
		.with([DraftStatus.active, RoundStatus.pre_bidding], () => (
			<p className="font-railroad-gothic text-lg">Bidding will start soon...</p>
		))
		.with([DraftStatus.active, RoundStatus.bidding], () =>
			draft.currentRound?.biddingStartTime && draft.info ?
				<BiddingControls
					draftId={draftId}
					draft={draft}
					roundLength={draft.info.roundLength}
					biddingStartTime={draft.currentRound.biddingStartTime}
				/>
			:	null,
		)
		.with([DraftStatus.active, RoundStatus.post_bidding], () => (
			<p className="font-railroad-gothic text-lg">Bidding is now closed.</p>
		))
		.otherwise(() => null);

	return <>{mainAction}</>;
};

export default UserControls;
