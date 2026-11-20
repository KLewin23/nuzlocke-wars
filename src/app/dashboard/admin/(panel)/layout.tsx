import { auth } from '@/auth/auth';
import { env } from '@/env/server';
import { headers } from 'next/headers';
import type { ReactNode } from 'react';
import DashboardNavbar from '@/organisms/DashboardNavbar';

import MfaRequiredDialog from '../MfaRequiredDialog';

interface Props {
	children: ReactNode;
}

const layout = async ({ children }: Props) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	console.log(env.SKIP_ADMIN_MFA);
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
