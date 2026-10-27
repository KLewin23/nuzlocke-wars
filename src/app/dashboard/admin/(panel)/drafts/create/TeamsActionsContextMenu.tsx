'use client';
import Button from '@/atoms/Button';
import { EllipsisVertical, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/atoms/dropdownMenu';

interface Props {
	onDelete: () => void;
}

const TeamsActionsContextMenu = ({ onDelete }: Props) => (
	<DropdownMenu>
		<DropdownMenuTrigger asChild>
			<Button variant="ghost">
				<EllipsisVertical />
			</Button>
		</DropdownMenuTrigger>
		<DropdownMenuContent>
			<DropdownMenuItem variant="destructive" onClick={onDelete}>
				<Trash />
				Delete User
			</DropdownMenuItem>
		</DropdownMenuContent>
	</DropdownMenu>
);

export default TeamsActionsContextMenu;
