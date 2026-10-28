import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import Navbar from '@/molecules/navbar';
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
				role === 'admin' ?
					{
						Drafts: '/dashboard/admin/drafts',
						Users: '/dashboard/admin/users',
						Settings: '/dashboard/admin/settings',
						'Sign Out': signOutAndRedirect,
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
