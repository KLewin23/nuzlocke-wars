'use client';

import { toast } from 'sonner';
import { Title } from '@images';
import { Button, Input } from '@atoms';
import { useRouter } from 'next/navigation';
import { MouseEvent, useState } from 'react';
import { authClient } from '@/lib/auth-client';

interface Props {
	searchParams: Promise<Record<string, string> | Array<string> | undefined>;
}

const page = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const router = useRouter();

	const handleLogin = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
		e.preventDefault();
		if (username === '') return toast.error('A username is required');
		if (password === '') return toast.error('A password is required');
		await authClient.signIn.username({
			username,
			password,
			fetchOptions: {
				onSuccess: () => void router.push('/dashboard/drafts'),
				onError: () => void toast.error('Invalid credentials, please try again.'),
			},
		});
	};

	return (
		<div className="col mt-[30vh] w-87.5 items-center gap-16 p-4">
			<Title />
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
				<Button onClick={e => handleLogin(e)}>Login</Button>
			</form>
		</div>
	);
};

export default page;
