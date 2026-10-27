'use client';
import { useState } from 'react';
import { match } from 'ts-pattern';
import Button from '@/atoms/Button';
import type { Role } from '@/db/authSchema';
import { Dialog } from '@/atoms/dialog/Dialog';
import { DialogTrigger } from '@/atoms/dialog/DialogTrigger';
import { EllipsisVertical, Pencil, RectangleEllipsis, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/atoms/dropdownMenu';

import DeleteUserDialog from './DeleteUserDialog';

interface Props {
	user: {
		id: string;
		username: string;
		role: Role;
	};
}

const UserActionsContextMenu = ({ user }: Props) => {
	const [openDialog, setOpenDialog] = useState<'none' | 'delete_user'>();

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
						<DropdownMenuItem>
							<Pencil /> Edit Details
						</DropdownMenuItem>
						<DropdownMenuItem>
							<RectangleEllipsis />
							Change Password
						</DropdownMenuItem>
						<DialogTrigger onClick={() => setOpenDialog('delete_user')} asChild>
							<DropdownMenuItem variant="destructive">
								<Trash />
								Delete User
							</DropdownMenuItem>
						</DialogTrigger>
					</DropdownMenuContent>
				</DropdownMenu>
				{match(openDialog)
					.with('delete_user', () => (
						<DeleteUserDialog
							userId={user.id}
							targetUsername={user.username}
							onClose={() => setOpenDialog('none')}
						/>
					))
					.otherwise(() => null)}
			</Dialog>
		</>
	);
};

export default UserActionsContextMenu;
