import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/atoms/Toaster';
import ThemeWrapper from '@/atoms/ThemeWrapper';
import { Quattrocento_Sans, Rye } from 'next/font/google';

import './globals.css';

const railroadGothic = localFont({
	src: '../../public/RailroadGothicCC.ttf',
	variable: '--font-railroad-gothic',
});

const quattrocentoSans = Quattrocento_Sans({
	variable: '--font-quattrocento-sans',
	weight: ['400', '700'],
});

const rye = Rye({
	variable: '--font-rye',
	weight: ['400'],
});

export const metadata: Metadata = {
	title: 'Nuzlocke Wars',
	description: 'Nuzlocke Wars',
};

const RootLayout = ({ children }: LayoutProps<'/'>) => (
	<html
		lang="en"
		suppressHydrationWarning
		className={`${quattrocentoSans.variable} ${railroadGothic.variable} ${rye.variable} h-full antialiased`}
	>
		<head>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta lang="en" />
		</head>
		<body className="flex min-h-full w-full flex-col">
			<ThemeWrapper>
				<Toaster />
				{children}
			</ThemeWrapper>
		</body>
	</html>
);

export default RootLayout;
