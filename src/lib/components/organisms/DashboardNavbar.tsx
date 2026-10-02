import React from 'react';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { Navbar } from '../molecules';

const DashboardNavbar = async () => {
	const hdrs = await headers();
	const session = await auth.api.getSession({
		headers: hdrs,
	});
	const role = session?.user.role;
	console.log(role)
	const signOutAndRedirect = async () => {
		'use server';
		await auth.api.signOut({
			headers: hdrs,
		});
		redirect('/dashboard/login');
	};

	return (
		<Navbar
			variant="dashbord"
			links={
				role === 'admin' || role === 'super' ?
					{
						DRAFTS: '/dashboard/admin/drafts',
						USERS: '/dashboard/admin/users',
						'SIGN OUT': signOutAndRedirect,
					}
				:	{
						DRAFTS: '/dashboard/drafts',
						'SIGN OUT': signOutAndRedirect,
					}
			}
		/>
	);
};

export { DashboardNavbar };
