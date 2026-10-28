import { Role } from '@/db/authSchema';
import type { RHFControl } from '@/type/form';
import type { CreateUserPayload } from '@/type/actions';
import { SelectContent, SelectGroup, SelectItem } from '@/atoms/select';
import { FieldGroup, InputField, SelectField } from '@/molecules/field';

interface Props {
	control: RHFControl<CreateUserPayload>;
}

const UserFieldsetContent = ({ control }: Props) => (
	<>
		<FieldGroup>
			<InputField
				name="username"
				control={control}
				label="Username"
				placeholder="Enter username."
				rules={{
					minLength: { message: 'Username must be at least 3 characters long.', value: 3 },
					maxLength: { message: 'Username must be shorter than 16 characters long.', value: 16 },
					required: { message: 'A username is required.', value: true },
				}}
			/>
			<InputField
				name="imageUrl"
				control={control}
				label="Profile Picture (URL)"
				placeholder="Enter profile image url."
				rules={{
					required: { message: 'A profile image is required.', value: true },
				}}
			/>
		</FieldGroup>
		<FieldGroup>
			<InputField
				name="password"
				type="password"
				control={control}
				rules={{
					minLength: { message: 'Password must be at least 8 characters long.', value: 8 },
					maxLength: { message: 'Password must be shorter than 32 characters long.', value: 32 },
				}}
				placeholder="Enter password."
				label="Password (Leave blank for auto generation)"
			/>
			<SelectField
				name="role"
				control={control}
				label="Role"
				rules={{
					required: { message: 'A profile image is required.', value: true },
				}}
			>
				<SelectContent>
					<SelectGroup>
						<SelectItem value={Role.user}>User</SelectItem>
						<SelectItem value={Role.admin}>Admin</SelectItem>
					</SelectGroup>
				</SelectContent>
			</SelectField>
		</FieldGroup>
	</>
);

export default UserFieldsetContent;
