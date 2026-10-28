import { toast } from 'sonner';
import QRCode from 'react-qr-code';
import Button from '@/atoms/Button';
import { Check } from 'lucide-react';
import { REGEXP_ONLY_DIGITS } from 'input-otp';
import { authClient } from '@/auth/auth-client';
import toastErrorMesage from '@/util/formError';
import { Controller, useForm } from 'react-hook-form';
import { Field } from '@/components/molecules/field/Field';
import { FieldLabel } from '@/components/molecules/field/FieldLabel';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/atoms/inputOTP';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/atoms/dialog';

interface FormValues {
	totpCode: string;
}

interface Props {
	totpUri?: string;
	onClose: () => void;
}

const VerifyMFASetupDialog = ({ totpUri, onClose }: Props) => {
	const { control, handleSubmit, reset } = useForm<FormValues>({
		defaultValues: {
			totpCode: '',
		},
	});

	const verifyMFA = async (values: FormValues) => {
		const { error } = await authClient.twoFactor.verifyTotp({
			code: values.totpCode,
		});
		if (error)
			return toast.error('MFA Verification Failed', {
				description: `Code verification failed with the message: ${error.message}, code: ${error.code}`,
			});

		toast.success('MFA Verified Successfully', {
			description: 'Code was validated, you will now have full access to Nuzlock Wars.',
		});
		onClose();
		reset();
	};

	return (
		<Dialog open={totpUri !== undefined} onOpenChange={onClose}>
			<form
				id="verify_mfa"
				onSubmit={e => void handleSubmit(verifyMFA, err => toastErrorMesage(['totpCode'], err))(e)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>MFA Setup</DialogTitle>
						<DialogDescription>
							Scan the below QR Code with an authenticator app like
							<br />
							Google Authenticator
						</DialogDescription>
					</DialogHeader>
					<div className="col w-full items-center gap-2">
						<QRCode value={totpUri ?? ''} className="h-50 w-50" />
						<Field className="col w-fit items-center">
							<FieldLabel>Verification Code</FieldLabel>
							<Controller
								name={'totpCode'}
								control={control}
								render={({ field, fieldState }) => (
									<InputOTP
										data-testid="verify_mfa_input"
										value={field.value}
										onChange={field.onChange}
										maxLength={6}
										pattern={REGEXP_ONLY_DIGITS}
									>
										<InputOTPGroup>
											<InputOTPSlot index={0} aria-invalid={fieldState.invalid} />
											<InputOTPSlot index={1} aria-invalid={fieldState.invalid} />
											<InputOTPSlot index={2} aria-invalid={fieldState.invalid} />
											<InputOTPSlot index={3} aria-invalid={fieldState.invalid} />
											<InputOTPSlot index={4} aria-invalid={fieldState.invalid} />
											<InputOTPSlot index={5} aria-invalid={fieldState.invalid} />
										</InputOTPGroup>
									</InputOTP>
								)}
							/>
						</Field>
					</div>
					<DialogFooter showCloseButton>
						<Button palette="blackOnWhite" type="submit" form="verify_mfa">
							<Check />
							Submit Verification Code
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
};

export default VerifyMFASetupDialog;
