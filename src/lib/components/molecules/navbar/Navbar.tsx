'use client';

import { Title } from '@images';
import { useWindowSize } from '@/lib/hooks';

import MobileDropdown from './MobileDropdown';

const Navbar = () => {
	const { isClient, width } = useWindowSize();

	return (
		<nav className="row bg-background font-railroad-gothic relative justify-center px-6">
			<div className="row max-w-250 grow items-center justify-between gap-5 py-6">
				<Title />
				{isClient && width > 600 ?
					<div className="row gap-8">
						<a href="/">
							<p className="font-railroad-gothic text-xl font-bold">HOME</p>
						</a>
						<a href="/">
							<p className="font-railroad-gothic text-xl font-bold">WARRIORS</p>
						</a>
						<a href="/">
							<p className="font-railroad-gothic text-xl font-bold">HIGHLIGHTS</p>
						</a>
						<a href="/">
							<p className="font-railroad-gothic text-xl font-bold">FAQ</p>
						</a>
					</div>
				:	<MobileDropdown />}
			</div>
		</nav>
	);
};

export { Navbar };
