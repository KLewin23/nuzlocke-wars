'use client';

import { toast } from 'sonner';
import { useTransition } from 'react';
import { TeamRole } from '@/db/draftSchema';
import Button from '@/components/atoms/Button';
import toastErrorMesage from '@/util/formError';
import { readableQueryFailure } from '@/util/query';
import { Controller, useForm } from 'react-hook-form';
import type { CreateDraftForm, User } from '@/type/form';
import { createDraft } from '@/actions/draft/createDraft';
import SubTitle from '@/components/atoms/typography/SubTitle';
import { FieldGroup, FieldSet, InputField } from '@/components/molecules/field';

import TeamsTable from './TeamsTable';
import PlayerTable from './PlayerTable';
import AddTeamDialog from './AddTeamDialog';

interface Props {
	existingTeams: Array<string>;
	users: Array<User>;
}

const AddDraftForm = ({ existingTeams, users }: Props) => {
	const { control, reset, handleSubmit } = useForm<CreateDraftForm>({
		defaultValues: {
			name: '',
			players: [],
			roundLength: 60,
			teams: [],
			initialPlayerCoins: 60,
		},
	});
	const [submitPending, startSubmitTransition] = useTransition();

	const submitUsers = (values: CreateDraftForm) =>
		startSubmitTransition(async () => {
			const response = await createDraft({
				...values,
				players: [
					...values.players.map(p => ({
						teamRole: TeamRole.player,
						userId: p.userId,
					})),
					...values.teams.map(t => ({
						teamName: t.name,
						teamRole: TeamRole.captain,
						userId: t.captain.id,
					})),
				],
			});
			if (response._type === 'left')
				return startSubmitTransition(() => {
					const failure = readableQueryFailure(response.value);
					toast.error(failure.title, { description: failure.description });
				});
			return startSubmitTransition(() => {
				toast('Users Created', {
					description: `Draft: \`${values.name}\` successfully created.`,
				});
				reset();
			});
		});

	return (
		<form
			className="col items-end gap-4"
			onSubmit={e =>
				void handleSubmit(submitUsers, err =>
					toastErrorMesage(['name', 'roundLength', 'initialPlayerCoins', 'teams', 'players'], err, false),
				)(e)
			}
		>
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
							placeholder="Enter round length."
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
							placeholder="Enter each players initial coin balance."
							label="Password (Leave blank for auto generation)"
						/>
					</FieldGroup>
				</FieldSet>
			</div>

			<div className="row w-full items-end justify-between">
				<SubTitle>Teams</SubTitle>
				<Controller
					name="teams"
					control={control}
					render={({ field }) => (
						<AddTeamDialog
							teamsInForm={field.value}
							users={users}
							existingTeams={existingTeams}
							onTeamSubmission={team => {
								field.onChange([...field.value, team]);
							}}
						/>
					)}
				/>
			</div>

			<TeamsTable control={control} users={users} />
			<PlayerTable control={control} users={users} />

			<Button palette="blackOnWhite" disabled={submitPending} className="w-full">
				Submit Draft
			</Button>
		</form>
	);
};

export default AddDraftForm;
