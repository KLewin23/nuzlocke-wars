'use client';

import { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { usePathname } from 'next/navigation';

interface Props {
	children: ReactNode;
}

const ThemeWrapper = ({ children }: Props) => {
	const pathname = usePathname();
	return (
		<ThemeProvider
			themes={['default', 'dashboard']}
			forcedTheme={pathname.startsWith('/dashboard') ? 'dashboard' : 'default'}
		>
			{children}
		</ThemeProvider>
	);
};

export default ThemeWrapper;
