'use client';

import { toast } from 'sonner';
import Button from '@/atoms/Button';
import { useForm } from 'react-hook-form';
import { authClient } from '@/auth/auth-client';
import { InputField } from '@/components/molecules/field';
import { DialogContent, DialogHeader, DialogTitle } from '@/atoms/dialog';

interface FormValues {
	newPassword: string;
}

interface Props {
	userId: string;
	targetUsername: string;
	onClose: () => void;
}

const UpdatePasswordDialog = ({ userId, targetUsername, onClose }: Props) => {
	const { control, handleSubmit } = useForm<FormValues>({
		defaultValues: {
			newPassword: '',
		},
	});

	const updatePassword = (v: FormValues) =>
		authClient.admin.setUserPassword({
			userId,
			newPassword: v.newPassword,
			fetchOptions: {
				onSuccess: () => {
					toast.success(`\`${targetUsername}\`'s password has been updated.`);
					onClose();
				},
				onError: err =>
					void toast.error('Failed to update users password.', { description: err.error.message }),
			},
		});

	return (
		<DialogContent>
			<DialogHeader>
				<DialogTitle>Update User Password</DialogTitle>
			</DialogHeader>
			<p>
				Proceeding will change:&nbsp;
				<span className="rounded bg-black/20 px-2 py-1 font-bold">{targetUsername}&apos;s</span> password.
			</p>
			<form className="col w-full gap-4" onSubmit={e => void handleSubmit(updatePassword)(e)}>
				<InputField
					name="newPassword"
					control={control}
					showError
					label="Enter the user's new password."
					placeholder="Enter new password."
					rules={{
						required: 'A new password is required.',
						minLength: { message: 'Password must be at least 8 characters long.', value: 8 },
						maxLength: { message: 'Password must be shorter than 32 characters long.', value: 32 },
					}}
				/>
				<Button palette="blackOnWhite">Update User&apos;s Password</Button>
			</form>
		</DialogContent>
	);
};

export default UpdatePasswordDialog;
