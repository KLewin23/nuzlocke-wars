'use client';

import Button from '@/atoms/Button';
import { addSeconds } from 'date-fns';
import { useTransition } from 'react';
import Countdown from 'react-countdown';
import handleAction from '@/util/actions';
import { useForm } from 'react-hook-form';
import createBid from '@/actions/bid/createBid';
import { authClient } from '@/auth/auth-client';
import toastErrorMesage from '@/util/formError';
import retractBid from '@/actions/bid/retractBid';
import type { GetFullDraft } from '@/type/queries';
import CountdownRenderer from '@/atoms/CountdownRenderer';
import { InputField } from '@/components/molecules/field';

interface Props {
	draftId: number;
	draft: GetFullDraft;
	biddingStartTime: Date;
	roundLength: number
}

const BiddingControls = ({ draftId, draft, biddingStartTime, roundLength }: Props) => {
	const [isPending, startTransition] = useTransition();
	const session = authClient.useSession();
	const runAction = handleAction(startTransition);
	const currentBid = draft?.currentRound?.bids.find(b => b.captainId === session.data?.user.id);
	const { control, handleSubmit } = useForm<{ bid: number }>({
		defaultValues: {
			bid: undefined,
		},
	});

	return (
		<div className="col items-center gap-1">
			<div className="row items-center gap-2">
				<p className="font-railroad-gothic text-lg">Bidding closes in:</p>
				<Countdown
					date={addSeconds(biddingStartTime, roundLength)}
					renderer={p => <CountdownRenderer {...p} />}
				/>
			</div>
			{currentBid !== undefined ?
				<Button
					palette="destructive"
					onClick={() =>
						runAction(retractBid(currentBid.id, draftId), () => ({
							title: 'Bid Retracted',
							description: 'Your bid was retracted.',
						}))
					}
				>
					Retract Bid
				</Button>
			:	<form
					className="row gap-2"
					onSubmit={e =>
						void handleSubmit(
							v =>
								runAction(createBid(draftId, v.bid), () => ({
									title: 'Bid Submitted',
									description: 'Your bid was submitted!',
								})),
							err => toastErrorMesage(['bid'], err, false),
						)(e)
					}
				>
					<InputField
						name="bid"
						control={control}
						placeholder="Enter your bid"
						type="number"
						rules={{
							required: 'You need to enter your bid',
							maxLength: { message: "You can' bid more than 999,999 (You're insane)", value: 999999 },
							minLength: { message: 'You at least need to big 1 coin... cmon', value: 1 },
						}}
					/>
					<Button palette="green" disabled={isPending}>
						Submit Bid
					</Button>
				</form>
			}
		</div>
	);
};

export default BiddingControls;
