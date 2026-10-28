import type { ReactNode } from 'react';
import DashboardNavbar from '@/organisms/DashboardNavbar';
import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import MfaRequiredDialog from '../MfaRequiredDialog';

interface Props {
	children: ReactNode;
}

const layout = async ({ children }: Props) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return (
		<>
			<DashboardNavbar />
			{children}
			{session?.user.role === 'admin' && !session.user.twoFactorEnabled ?
				<MfaRequiredDialog />
			:	null}
		</>
	);
};

export default layout;
