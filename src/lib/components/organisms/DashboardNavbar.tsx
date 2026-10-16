import { auth } from '@/auth';
import Navbar from '@molecules/navbar';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

const DashboardNavbar = async () => {
	const hdrs = await headers();
	const session = await auth.api.getSession({
		headers: hdrs,
	});
	const role = session?.user.role;
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
						Drafts: '/dashboard/admin/drafts',
						// USERS: '/dashboard/admin/users',
						// 'SIGN OUT': signOutAndRedirect,
					}
				:	{
						Drafts: '/dashboard/drafts',
						'Sign Out': signOutAndRedirect,
					}
			}
		/>
	);
};

export default DashboardNavbar;
