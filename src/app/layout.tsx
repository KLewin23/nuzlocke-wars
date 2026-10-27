import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Toaster } from '@/atoms/Toaster';
import ThemeWrapper from '@/atoms/ThemeWrapper';
import { TRPCReactProvider } from '@/trpc/client';
import { Analytics } from '@vercel/analytics/next';
import { Quattrocento_Sans, Rye } from 'next/font/google';
import TooltipProvider from '@/components/atoms/tooltip/TooltipProvider';

import './globals.css';

const ithaca = localFont({
	src: '../../public/Ithaca.ttf',
	variable: '--font-ithaca',
});

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
		className={`${quattrocentoSans.variable} ${railroadGothic.variable} ${rye.variable} ${ithaca.variable} h-full antialiased`}
	>
		<head>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta lang="en" />
		</head>
		<body className="flex min-h-full w-full flex-col">
			<ThemeWrapper>
				<Toaster />
				<TooltipProvider>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</TooltipProvider>
				<Analytics />
			</ThemeWrapper>
		</body>
	</html>
);

export default RootLayout;
