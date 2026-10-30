'use client';

import Link from 'next/link';
import Title from '@/images/Title';
import useWindowSize from '@/hooks/useWindowSize';
import cn, { type VariantProps, cva } from 'cnfast';

import MobileDropdown from './MobileDropdown';

const buttonVariants = cva('row font-railroad-gothic relative justify-center px-6', {
	variants: {
		variant: {
			default: 'bg-background',
			dashboard: '',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
});

interface Props {
	links: Record<string, string | (() => Promise<unknown>)>; // Record<title, link>
}

const Navbar = ({
	variant,
	className,
	links,
}: React.ComponentProps<'div'> & VariantProps<typeof buttonVariants> & Props) => {
	const { isClient, width } = useWindowSize();

	return (
		<nav data-variant={variant} className={cn(buttonVariants({ variant, className }))}>
			<div className="row max-w-250 grow items-center justify-between gap-5 py-6">
				<Link href={variant === 'dashboard' ? "/dashboard/drafts" : '/'}>
					<Title variant={variant !== 'dashboard' ? 'default' : 'dashboard'} />
				</Link>
				{isClient && width > 600 ?
					<div className="row gap-8">
						{Object.entries(links).map(([title, action]) =>
							typeof action === 'string' ?
								<a href={action} key={`navlink-${title}-${action}`}>
									<p className="font-railroad-gothic text-xl font-bold">{title}</p>
								</a>
							:	<button key={`navlink-${title}`} className="cursor-pointer" onClick={() => void action()}>
									<p className="font-railroad-gothic text-xl font-bold">{title}</p>
								</button>,
						)}
					</div>
				:	<MobileDropdown />}
			</div>
		</nav>
	);
};

export default Navbar;
