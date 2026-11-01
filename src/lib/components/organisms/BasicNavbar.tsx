import Navbar from '@/molecules/navbar';

import type { NavbarProps } from '../molecules/navbar/Navbar';

const BasicNavbar = (props: Omit<NavbarProps, 'links'>) => (
	<Navbar
		{...props}
		links={{
			HOME: '/',
			CONTENT: '/content',
			// WARRIORS: '/',
			// HIGHLIGHTS: '/',
			// FAQ: '/',
		}}
	/>
);

export default BasicNavbar;
