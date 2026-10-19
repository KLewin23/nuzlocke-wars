'use client';

import { toast } from 'sonner';
import Button from '@/atoms/Button';
import { useForm } from 'react-hook-form';
import { authClient } from '@/auth/auth-client';
import { InputField } from '@/components/molecules/field';
import { DialogContent, DialogHeader, DialogTitle } from '@/atoms/dialog';

interface Props {
	userId: string;
	targetUsername: string;
	onClose: () => void;
}

const DeleteUserDialog = ({ userId, targetUsername, onClose }: Props) => {
	const { control, handleSubmit } = useForm<{ username: string }>({
		defaultValues: {
			username: '',
		},
	});

	const deleteUser = () =>
		authClient.admin.removeUser({
			userId,
			fetchOptions: {
				onSuccess: () => {
					toast.success(`User \`${targetUsername}\` deleted.`);
					onClose();
				},
				onError: err => void toast.error('Failed to delete user.', { description: err.error.message }),
			},
		});

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Delete User</DialogTitle>
			</DialogHeader>
			<p>
				Proceeding will delete:&nbsp;
				<span className="rounded bg-black/20 px-2 py-1 font-bold">{targetUsername}</span>
			</p>
			<form className="col w-full gap-4" onSubmit={e => void handleSubmit(deleteUser)(e)}>
				<InputField
					name="username"
					control={control}
					showError
					label="Enter the user's username to proceed."
					placeholder="Enter username to be deleted."
					rules={{
						required: 'You must match the target username to proceed',
						validate: uname =>
							uname === targetUsername ? true : "Validation username must match target user's username",
					}}
				/>
				<Button palette="destructive">Delete User</Button>
			</form>
		</DialogContent>
	);
};

export default DeleteUserDialog;
