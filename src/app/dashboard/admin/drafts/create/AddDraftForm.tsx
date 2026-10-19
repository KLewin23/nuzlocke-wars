'use client';

import { useForm } from 'react-hook-form';
import type { CreateDraftForm, ExistingTeam, User } from '@/type/form';
import { FieldGroup, FieldSet, InputField } from '@/components/molecules/field';

import TeamsTable from './TeamsTable';
import AddTeamDialog from './AddTeamDialog';
import AddNewTeamForm from './AddNewTeamForm';

interface Props {
	existingTeams: Array<ExistingTeam>;
	users: Array<User>;
}

const AddDraftForm = ({ existingTeams, users }: Props) => {
	const { control, getValues, trigger } = useForm<CreateDraftForm>({
		defaultValues: {
			name: '',
			players: [],
			roundLength: 60,
			teams: existingTeams,
			initialPlayerCoins: 60,
			newTeamName: '',
		},
	});

	return (
		<form className="col items-end gap-4">
			<div className="col w-full gap-4 border border-black/30 bg-black/20 px-2 py-4">
				<FieldSet className="flex-row" data-testid="new-user-form">
					<FieldGroup>
						<InputField
							name="name"
							control={control}
							label="Name"
							placeholder="Enter draft name."
							rules={{
								minLength: { message: 'Draft name must be at least 3 characters long.', value: 3 },
								maxLength: {
									message: 'Draft name must be shorter than 32 characters long.',
									value: 32,
								},
								required: { message: 'A name is required.', value: true },
							}}
						/>
						<InputField
							name="roundLength"
							type="number"
							control={control}
							label="Round length (seconds)"
							placeholder="Enter round lenght."
							rules={{
								required: { message: 'A round length is required.', value: true },
							}}
						/>
					</FieldGroup>
					<FieldGroup>
						<InputField
							name="initialPlayerCoins"
							type="number"
							control={control}
							rules={{
								required: 'Initial player coins is required',
							}}
							placeholder="Enter password."
							label="Password (Leave blank for auto generation)"
						/>
					</FieldGroup>
				</FieldSet>
			</div>
			<div className="row w-full items-end gap-4">
				<AddNewTeamForm
					control={control}
					users={users}
					getFormValues={getValues}
					triggerFormValidation={trigger}
				/>

				<AddTeamDialog existingTeams={existingTeams} />
			</div>
			<TeamsTable control={control} users={users} />
		</form>
	);
};

export default AddDraftForm;
