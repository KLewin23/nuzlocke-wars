import React from 'react';
import { UserGroup } from 'lucide-react';
import Button from '@/components/atoms/Button';
import type { ExistingTeam } from '@/type/form';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/atoms/dialog';

interface Props {
	existingTeams: Array<ExistingTeam>;
}

const AddTeamDialog = ({ existingTeams }: Props) => (
	<Dialog>
		<DialogTrigger asChild>
			<Button palette="blackOnWhite" type="button" className="h-10.5">
				<UserGroup />
				Select Existing Team
			</Button>
		</DialogTrigger>
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Select Playing Teams</DialogTitle>
				<DialogDescription>
					This action cannot be undone. This will permanently delete your account and remove your data from
					our servers.
				</DialogDescription>
			</DialogHeader>
			<form>
				test
			</form>

		</DialogContent>
	</Dialog>
);

export default AddTeamDialog;
