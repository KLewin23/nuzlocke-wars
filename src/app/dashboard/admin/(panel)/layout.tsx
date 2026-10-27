import type { ReactNode } from 'react';
import DashboardNavbar from '@/organisms/DashboardNavbar';

interface Props {
    children: ReactNode;
}

const layout = ({ children }: Props) => (
    <>
        <DashboardNavbar />
        {children}
    </>
);

export default layout;
