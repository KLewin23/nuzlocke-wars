'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import type { Team, User } from '@/type/form';
import Button from '@/components/atoms/Button';
import { Plus, UserGroup } from 'lucide-react';
import toastErrorMesage from '@/util/formError';
import { Controller, useForm } from 'react-hook-form';
import { SelectField } from '@/components/molecules/field';
import { Field } from '@/components/molecules/field/Field';
import { FieldLabel } from '@/components/molecules/field/FieldLabel';
import { SelectContent, SelectGroup, SelectItem } from '@/components/atoms/select';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/atoms/dialog';

import TeamNameCombobox from './TeamNameCombobox';

interface Props {
	existingTeams: Array<string>;
	teamsInForm: Array<Team>;
	users: Array<User>;
	onTeamSubmission: (team: Team) => void;
}

interface NewTeamForm {
	teamName: string;
	teamCaptainUsername: string;
}

const AddTeamDialog = ({ existingTeams, teamsInForm, users, onTeamSubmission }: Props) => {
	const [isOpen, setIsOpen] = useState(false);

	const { control, handleSubmit, setError } = useForm<NewTeamForm>({
		defaultValues: {
			teamCaptainUsername: '',
			teamName: '',
		},
	});

	const submitTeam = (values: NewTeamForm) => {
		const captain = users.find(u => u.username === values.teamCaptainUsername);
		if (!captain)
			return setError('teamCaptainUsername', {
				type: 'validate',
				message: `user with username \`${values.teamCaptainUsername}\` not found in user list`,
			});
		toast.success('Team staged.');
		onTeamSubmission({
			name: values.teamName,
			captain,
			isNew: existingTeams.every(team => team !== values.teamName),
		});
		return setIsOpen(false);
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button palette="blackOnWhite" type="button" className="h-10.5">
					<UserGroup />
					Select Existing Team
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Select Playing Teams</DialogTitle>
					<DialogDescription>Select or Create a team and it&apos;s captain</DialogDescription>
				</DialogHeader>
				<form
					className="col gap-8 px-8 py-4"
					onSubmit={e => {
						e.stopPropagation()
						void handleSubmit(submitTeam, err =>
							toastErrorMesage(['teamName', 'teamCaptainUsername'], err, false),
						)(e);
					}}
				>
					<Controller
						name="teamName"
						control={control}
						render={({ field }) => (
							<Field>
								<FieldLabel>Select or Enter the team&apos;s name</FieldLabel>
								<TeamNameCombobox
									existingTeams={existingTeams}
									onChange={field.onChange}
									selectedTeamName={field.value}
								/>
							</Field>
						)}
					/>

					<SelectField
						name="teamCaptainUsername"
						control={control}
						label="Select The Team Captain"
						rules={{
							required: { message: 'A team name is required.', value: true },
							validate: captainUsername => {
								if (teamsInForm.some(t => t.captain.username === captainUsername))
									return 'A user can only captain one team in each draft.';
								if (users.every(u => u.username !== captainUsername))
									return "Captains username must be a valid user's username.";
								return true;
							},
						}}
						placeholder="Select The Team Captain"
					>
						<SelectContent>
							<SelectGroup>
								{users.map(user => (
									<SelectItem key={user.id} value={user.username}>
										{user.username}
									</SelectItem>
								))}
							</SelectGroup>
						</SelectContent>
					</SelectField>
					<Button palette="blackOnWhite" className="h-10.5">
						<Plus />
						Add New Team
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
};

export default AddTeamDialog;
