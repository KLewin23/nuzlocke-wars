'use client';

import Link from 'next/link';
import { match } from 'ts-pattern';
import Button from '@/atoms/Button';
import { Dialog } from '@/atoms/dialog/Dialog';
import { DraftStatus } from '@/db/draftSchema';
import { useState, useTransition } from 'react';
import createActionHandler from '@/util/actions';
import archiveDraft from '@/actions/draft/archiveDraft';
import { DialogTrigger } from '@/atoms/dialog/DialogTrigger';
import { Archive, EllipsisVertical, LockKeyhole, LockKeyholeOpen, SquarePlus, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/atoms/dropdownMenu';

import DeleteDraftDialog from './DeleteDraftDialog';
import ToggleOpenDraftDialog from './ToggleOpenDraftDialog';

interface Props {
	draft: {
		id: number;
		name: string;
		status: DraftStatus;
	};
}

const DraftActionsContextMenu = ({ draft }: Props) => {
	const [openDialog, setOpenDialog] = useState<'none' | 'open_draft' | 'delete_draft'>();
	const [isPending, startTransition] = useTransition();
	const handleAction = createActionHandler(startTransition);

	const archiveDraftAction = () =>
		handleAction(archiveDraft(draft.id), () => ({
			title: 'Draft Archived',
			description: 'Draft has been archived and will no longer appear in the main list.',
		}));

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
						<DialogTrigger onClick={() => setOpenDialog('delete_draft')} asChild>
							<DropdownMenuItem variant="default">
								<Trash />
								Delete Draft
							</DropdownMenuItem>
						</DialogTrigger>
						<DialogTrigger onClick={archiveDraftAction} disabled={isPending} asChild>
							<DropdownMenuItem variant="default">
								<Archive />
								Archive Draft
							</DropdownMenuItem>
						</DialogTrigger>
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
					.with('delete_draft', () => (
						<DeleteDraftDialog
							draftId={draft.id}
							targetDraftName={draft.name}
							onClose={() => setOpenDialog('none')}
						/>
					))
					.otherwise(() => null)}
			</Dialog>
		</>
	);
};

export default DraftActionsContextMenu;
