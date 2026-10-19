import { toast } from 'sonner';
import Button from '@/atoms/Button';
import { Plus } from 'lucide-react';
import { InputField, SelectField } from '@/molecules/field';
import type { CreateDraftForm, RHFControl, User } from '@/type/form';
import { SelectContent, SelectGroup, SelectItem } from '@/components/atoms/select';
import { Controller, type ControllerRenderProps, type UseFormTrigger } from 'react-hook-form';

interface Props {
	users: Array<User>;
	control: RHFControl<CreateDraftForm>;
	getFormValues: () => CreateDraftForm;
	triggerFormValidation: UseFormTrigger<CreateDraftForm>;
}

// onAddTeam={newTeam => field.onChange([...field.value, { name: newTeam }])}

const AddNewTeamForm = ({ users, control, getFormValues, triggerFormValidation }: Props) => {
	const updateTeams = async (field: ControllerRenderProps<CreateDraftForm, 'teams'>) => {
		const triggeredValidations = await triggerFormValidation(['newTeamName', 'newTeamCaptainUsername']);
		if (triggeredValidations) {
			const formValues = getFormValues();
			const captain = users.find(u => u.username === formValues.newTeamCaptainUsername);
			if (!captain) return toast.error('Action Failure', { description: 'Failed to find selected captain.' });
			field.onChange([...field.value, { name: formValues.newTeamName, captain }]);
		}
	};

	return (
		<div className="row w-full grow items-end justify-between gap-8">
			<InputField
				name="newTeamName"
				control={control}
				showError
				placeholder="Enter new team's name"
				label="New Team's Name"
				rules={{
					minLength: { message: 'Team name must be at least 3 characters long.', value: 3 },
					maxLength: { message: 'Team name must be shorter than 32 characters long.', value: 32 },
					required: { message: 'A team name is required.', value: true },
					validate: name =>
						getFormValues().teams.some(t => t.name === name) ? 'Team name must be unique' : true,
				}}
			/>
			<SelectField
				name="newTeamCaptainUsername"
				control={control}
				label="Select The Team Captain"
				rules={{
					required: { message: 'A team name is required.', value: true },
					validate: captain =>
						getFormValues().teams.some(t => t.captain?.username === captain) ?
							'A user can only captain one team in each draft.'
						:	true,
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
			<Controller
				name="teams"
				control={control}
				render={({ field }) => (
					<Button
						palette="blackOnWhite"
						className="h-10.5"
						type="button"
						onClick={() => void updateTeams(field)}
					>
						<Plus />
						Add New Team
					</Button>
				)}
			/>
		</div>
	);
};

export default AddNewTeamForm;
