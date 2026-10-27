'use client';

import { Role } from '@/db/authSchema';
import { useForm } from 'react-hook-form';
import { FieldSet } from '@/molecules/field';
import Button from '@/components/atoms/Button';
import toastErrorMesage from '@/util/formError';
import type { CreateUserPayload } from '@/type/actions';

import UserFieldsetContent from './UserFieldsetContent';

interface Props {
	onStageUser: (user: CreateUserPayload) => void;
}

const UserForm = ({ onStageUser }: Props) => {
	const { control, handleSubmit, reset } = useForm<CreateUserPayload>({
		criteriaMode: 'firstError',
		defaultValues: {
			username: '',
			role: Role.user,
			imageUrl: '',
			password: '',
		},
	});

	return (
		<form
			className="col gap-4 border border-black/30 bg-black/20 px-2 py-4"
			onSubmit={e =>
				void handleSubmit(
					u => {
						onStageUser(u);
						reset();
					},
					err => toastErrorMesage(['username', 'imageUrl', 'password', 'role'], err),
				)(e)
			}
		>
			<FieldSet className="flex-row" data-testid="new-user-form">
				<UserFieldsetContent control={control} />
			</FieldSet>
			<Button palette="blackOnWhite" className="w-fit self-end px-4">
				Stage User
			</Button>
		</form>
	);
};

export default UserForm;
