import React from 'react';
import { auth } from '@/auth/auth';
import { Info } from 'lucide-react';
import { headers } from 'next/headers';
import Title from '@/components/atoms/typography/Title';
import DashboardNavbar from '@/components/organisms/DashboardNavbar';

import EnableMFAForm from './EnableMFAForm';

const page = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	return (
		<>
			<DashboardNavbar />
			<div className="col w-full max-w-250 grow gap-6 self-center overflow-hidden">
				<div className="col gap-2">
					<Title>Multi Factor Authentication</Title>
					<div className="row items-center gap-2">
						<Info size={23} />
						<p className="font-bold">Enable TOTP MFA to gain full access to the site.</p>
					</div>
				</div>
				<div className="col w-full gap-2 overflow-hidden pb-4">
					{session?.user.twoFactorEnabled ?
						<div className="col gap-1">
							<p className="font-bold">Multifactor Authentication is configured</p>
							<p>Reconfiguring below will wipe past configurations.</p>
						</div>
					:	null}
					<EnableMFAForm MFAAlreadyConfigured={session?.user.twoFactorEnabled ?? false} />
				</div>
			</div>
		</>
	);
};

export default page;
