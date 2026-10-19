'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { ThemeProvider } from '@teispace/next-themes';

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
