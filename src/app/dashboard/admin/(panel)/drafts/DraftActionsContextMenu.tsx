'use client';

import Link from 'next/link';
import { useState } from 'react';
import { match } from 'ts-pattern';
import Button from '@/atoms/Button';
import { Dialog } from '@/atoms/dialog/Dialog';
import { DraftStatus } from '@/db/draftSchema';
import { DialogTrigger } from '@/atoms/dialog/DialogTrigger';
import { EllipsisVertical, LockKeyhole, LockKeyholeOpen, SquarePlus } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/atoms/dropdownMenu';

import ToggleOpenDraftDialog from './ToggleOpenDraftDialog';

interface Props {
	draft: {
		id: number;
		name: string;
		status: DraftStatus;
	};
}

const DraftActionsContextMenu = ({ draft }: Props) => {
	const [openDialog, setOpenDialog] = useState<'none' | 'open_draft'>();

	return (
		<>
			<Dialog onOpenChange={open => (open === false ? setOpenDialog('none') : undefined)}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost">
							<EllipsisVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						{draft.status === DraftStatus.closed || draft.status === DraftStatus.open ?
							draft.status === DraftStatus.closed ?
								<DialogTrigger onClick={() => setOpenDialog('open_draft')} asChild>
									<DropdownMenuItem variant="default">
										<LockKeyholeOpen />
										Open Draft
									</DropdownMenuItem>
								</DialogTrigger>
							:	<>
									<DropdownMenuItem variant="default" asChild>
										<Link href={`/dashboard/admin/draft/${draft.id}`}>
											<SquarePlus />
											Join Draft
										</Link>
									</DropdownMenuItem>
									<DropdownMenuItem variant="default">
										<LockKeyhole />
										Close Draft
									</DropdownMenuItem>
								</>

						: draft.status === DraftStatus.active ?
							<DropdownMenuItem variant="default" asChild>
								<Link href={`/dashboard/admin/draft/${draft.id}`}>
									<SquarePlus />
									Join Draft
								</Link>
							</DropdownMenuItem>
						:	<DropdownMenuItem variant="default">I&apos;m empty...</DropdownMenuItem>}
					</DropdownMenuContent>
				</DropdownMenu>
				{match(openDialog)
					.with('open_draft', () =>
						draft.status === DraftStatus.closed || draft.status === DraftStatus.open ?
							<ToggleOpenDraftDialog
								mode={draft.status === DraftStatus.closed ? 'openDraft' : 'closeDraft'}
								draftId={draft.id}
								targetDraftName={draft.name}
								onClose={() => setOpenDialog('none')}
							/>
						:	<div />,
					)
					.otherwise(() => null)}
			</Dialog>
		</>
	);
};

export default DraftActionsContextMenu;
