import type { ReactNode } from 'react';
import DashboardNavbar from '@/organisms/DashboardNavbar';

interface Props {
	children: ReactNode;
}

const layout = ({ children }: Props) => (
	<div className="col w-full gap-8 h-screen max-h-screen overflow-hidden">
		<DashboardNavbar />
		{children}
	</div>
);

export default layout;
