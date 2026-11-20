import type { ReactNode } from 'react';
import DashboardNavbar from '@/organisms/DashboardNavbar';
import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import MfaRequiredDialog from '../MfaRequiredDialog';
import { env } from '@/env/server';

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
			{session?.user.role === 'admin' && !session.user.twoFactorEnabled && !env.SKIP_ADMIN_MFA ?
				<MfaRequiredDialog />
			:	null}
		</>
	);
};

export default layout;
