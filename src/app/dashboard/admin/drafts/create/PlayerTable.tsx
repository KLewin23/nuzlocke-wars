'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Controller } from 'react-hook-form';
import Button from '@/components/atoms/Button';
import { Field } from '@/components/molecules/field/Field';
import SubTitle from '@/components/atoms/typography/SubTitle';
import { FieldLabel } from '@/components/molecules/field/FieldLabel';
import type { CreateDraftForm, RHFControl, User } from '@/type/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/atoms/table';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/atoms/select';

import DeletionContextMenu from './DeletionContextMenu';

interface Props {
	control: RHFControl<CreateDraftForm>;
	users: Array<User>;
}

const PlayerTable = ({ control, users }: Props) => {
	const [selectedUser, setSelectedUser] = useState('');

	return (
		<Controller
			name="players"
			control={control}
			render={({ field }) => (
				<>
					<div className="row w-full items-end justify-between gap-4">
						<SubTitle>Players</SubTitle>
						<div className="row items-end gap-4">
							<Field>
								<FieldLabel htmlFor="select-draft-player">Select Draft Player</FieldLabel>
								<Select value={selectedUser} onValueChange={setSelectedUser}>
									<SelectTrigger id="select-draft-player" className="min-w-100">
										<SelectValue placeholder="Select a player to add." />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{users.map(user => (
												<SelectItem key={user.username} value={user.username}>
													{user.username}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</Field>
							<Button
								palette="blackOnWhite"
								type="button"
								className="h-10.5"
								onClick={() => {
									if (selectedUser === '')
										return toast.error('Form validation error', {
											description: 'A selected user is required.',
										});
									const user = users.find(u => u.username === selectedUser);
									if (!user)
										return toast.error('Form validation error', {
											description: 'Failed to fnd selected user.',
										});
									if (field.value.some(u => u.username === selectedUser))
										return toast.info('User is already selected for draft.');
									field.onChange([
										...field.value,
										{
											userId: user.id,
										},
									]);
								}}
							>
								<Plus />
								Add User
							</Button>
						</div>
					</div>
					<div className="w-full grow overflow-scroll">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Username</TableHead>
									<TableHead>Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{field.value.length === 0 ?
									<TableRow>
										<TableCell colSpan={4}>
											<p className="font-white min-h-40 font-sans text-lg leading-50">
												No teams selected.
											</p>
										</TableCell>
									</TableRow>
								:	field.value.map(player => (
										<TableRow key={`${player.username}-1`}>
											<TableCell>{player.username}</TableCell>
											<TableCell>
												<DeletionContextMenu
													onDelete={() =>
														field.onChange(field.value.filter(p => p === player))
													}
												/>
											</TableCell>
										</TableRow>
									))
								}
							</TableBody>
						</Table>
					</div>
				</>
			)}
		/>
	);
};

export default PlayerTable;
