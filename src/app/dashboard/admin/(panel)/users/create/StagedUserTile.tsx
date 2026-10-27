'use client';

import Image from 'next/image';
import Button from '@/atoms/Button';
import { useForm } from 'react-hook-form';
import { FieldSet } from '@/molecules/field';
import { Pencil, Save, Trash } from 'lucide-react';
import type { CreateUserPayload } from '@/type/actions';

import UserFieldsetContent from './UserFieldsetContent';

interface Props {
	user: CreateUserPayload;
	isUserEditing: boolean;
	onSaveUser: (user: CreateUserPayload) => void;
	onStartEditUser: () => void;
	onDeleteUser: () => void;
}

const StagedUserTile = ({ user, isUserEditing, onSaveUser, onStartEditUser, onDeleteUser }: Props) => {
	const { control, handleSubmit } = useForm<CreateUserPayload>({
		defaultValues: {
			username: user.username ?? '',
			password: user.password ?? '',
			imageUrl: user.imageUrl ?? '',
			role: user.role ?? '',
		},
	});

	return (
		<div key={user.username} className="row w-full gap-4 bg-black/20 p-4">
			<div className="h-50 w-50 border border-black/30">
				{user.imageUrl ?
					<Image
						unoptimized
						className="h-full w-full object-cover"
						src={user.imageUrl}
						alt={`${user.username}'s profile picture`}
						height={200}
						width={200}
					/>
				:	null}
			</div>
			<form className="col grow gap-2" onSubmit={e => void handleSubmit(onSaveUser)(e)}>
				<FieldSet className="grow flex-row" disabled={!isUserEditing}>
					<UserFieldsetContent control={control} />
				</FieldSet>
				<div className="row gap-4 self-end">
					<Button
						palette="destructive"
						onClick={e => {
							e.preventDefault();
							onDeleteUser();
						}}
					>
						<Trash />
						Delete User
					</Button>
					{isUserEditing ?
						<Button palette="blackOnWhite">
							<Save />
							Save User
						</Button>
					:	<Button
							palette="blackOnWhite"
							onClick={e => {
								e.preventDefault();
								return onStartEditUser();
							}}
						>
							<Pencil />
							Edit User
						</Button>
					}
				</div>
			</form>
		</div>
	);
};

export default StagedUserTile;
