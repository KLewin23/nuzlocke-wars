'use client';

import { toast } from 'sonner';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/atoms/Button';
import { authClient } from '@/auth/auth-client';
import toastErrorMesage from '@/util/formError';
import { FieldSet, InputField } from '@/components/molecules/field';

import VerifyMFASetupDialog from './VerifyMFASetupDialog';

interface FormValues {
	password: string;
}

interface Props {
	MFAAlreadyConfigured: boolean;
}

const EnableMFAForm = ({ MFAAlreadyConfigured }: Props) => {
	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			password: '',
		},
	});
	const [totpURI, setTotpURI] = useState<string | undefined>(undefined);

	const enableMfa = async (values: FormValues) => {
		const { data, error } = await authClient.twoFactor.enable({
			password: values.password, // required, The user’s password. Required for email/password accounts.
			method: 'totp', // The 2FA method to enable.
			issuer: 'Nuzlocke Wars', // Custom issuer for the TOTP URI. Defaults to the app name in your auth config.
		});
		if (error)
			return toast.error('MFA Setup Failed', {
				description: `MFA Setup failed with message: ${error.message}, code: ${error.code}`,
			});
		if (!error && data.method === 'totp') setTotpURI(data.totpURI);

		reset();
	};

	return (
		<>
			<VerifyMFASetupDialog totpUri={totpURI} onClose={() => setTotpURI(undefined)} />
			<form
				className="col max-w-md gap-4 border border-black/30 bg-black/20 px-2 py-4"
				onSubmit={e => void handleSubmit(enableMfa, err => toastErrorMesage(['password'], err))(e)}
			>
				<FieldSet className="flex-row" data-testid="new-user-form">
					<InputField
						name="password"
						control={control}
						label="Password"
						type="password"
						placeholder="Enter password."
						rules={{
							required: { message: 'Your password is required.', value: true },
						}}
					/>
				</FieldSet>
				<Button palette="blackOnWhite" className="w-fit self-end px-4">
					{MFAAlreadyConfigured ? 'Reconfigure MFA' : 'Enable MFA'}
				</Button>
			</form>
		</>
	);
};

export default EnableMFAForm;
