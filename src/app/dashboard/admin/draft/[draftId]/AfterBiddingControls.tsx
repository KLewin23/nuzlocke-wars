'use client';

import Button from '@/atoms/Button';
import { useTransition } from 'react';
import handleAction from '@/util/actions';
import replayBidding from '@/actions/draft/replayBidding';
import { ChevronDownIcon, RotateCcw } from 'lucide-react';
import startNextRound from '@/actions/draft/startNextRound';
import ButtonGroup from '@/components/molecules/buttonGroup/ButtonGroup';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/atoms/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/atoms/dropdownMenu';

interface Props {
	draftId: number;
}

const AfterBiddingControls = ({ draftId }: Props) => {
	const [isPending, startTransition] = useTransition();
	const runAction = handleAction(startTransition);

	return (
		<ButtonGroup className="gradient-radial-green">
			<Button
				palette="default"
				className="3xl:text-xl w-40 text-lg max-h-11"
				disabled={isPending}
				onClick={() =>
					runAction(startNextRound(draftId), () => ({
						title: 'Next Round Opened',
						description: 'Next round was opened successfully, and players have been told.',
					}))
				}
			>
				Open Next Round
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button palette="default" className="border-l border-l-black/30 pl-2! max-h-11">
						<ChevronDownIcon strokeWidth={4} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-44">
					<Tooltip>
						<TooltipTrigger>
							<DropdownMenuItem
								onClick={() =>
									runAction(replayBidding(draftId), () => ({
										title: 'Replaying Round',
										description: 'Round replay has been triggered (bids are wiped).',
									}))
								}
							>
								<RotateCcw />
								Replay Round
							</DropdownMenuItem>
						</TooltipTrigger>
						<TooltipContent>
							<p>This will wipe all bids, and allow you to replay the round.</p>
						</TooltipContent>
					</Tooltip>
				</DropdownMenuContent>
			</DropdownMenu>
		</ButtonGroup>
	);
};

export default AfterBiddingControls;
