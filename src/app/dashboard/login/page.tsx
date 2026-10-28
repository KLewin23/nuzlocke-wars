'use client';

import z from 'zod';
import { toast } from 'sonner';
import Title from '@/images/Title';
import Button from '@/atoms/Button';
import { Input } from '@/atoms/Input';
import { useRouter } from 'next/navigation';
import { authClient } from '@/auth/auth-client';
import { type MouseEvent, useState } from 'react';
import VerifyMFADialog from './VerifyMFADialog';

const successContextSchema = z.object({ data: z.object({ twoFactorMethods: z.array(z.string()) }) });

const Page = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [verifyMfa, setVerifyMfa] = useState(false);
	const router = useRouter();

	const handleLogin = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		e.preventDefault();
		if (username === '') return toast.error('A username is required');
		if (password === '') return toast.error('A password is required');
		await authClient.signIn
			.username({
				username,
				password,
				fetchOptions: {
					onSuccess: context => {
						const hasMFA = successContextSchema.safeParse(context);
						if (hasMFA.success && hasMFA.data.data.twoFactorMethods.includes('totp'))
							return setVerifyMfa(true);

						router.push('/dashboard/drafts');
					},
					onError: err => {
						toast.error(err.error.message ?? 'Invalid credentials, please try again.');
					},
				},
			})
			.catch(
				() => void toast.error('Login Failure', { description: 'An error occoured when attempting to login.' }),
			);
	};

	return (
		<div className="col mt-[30vh] w-87.5 items-center gap-16 p-4">
			<VerifyMFADialog isOpen={verifyMfa} onClose={() => setVerifyMfa(false)}/>
			<Title variant="dashboard" />
			<form className="col w-full gap-8">
				<Input
					placeholder="Enter your username"
					value={username}
					onChange={e => setUsername(e.currentTarget.value)}
				/>
				<Input
					placeholder="Enter your password"
					type="password"
					value={password}
					onChange={e => setPassword(e.currentTarget.value)}
				/>
				<Button palette="gold" onClick={e => void handleLogin(e)}>
					Login
				</Button>
			</form>
		</div>
	);
};

export default Page;
