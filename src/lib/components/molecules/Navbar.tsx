import { Title } from '@images';

const Navbar = () => {
	return (
		<nav className="row bg-background/50 items-center justify-between gap-5 px-72 py-6 font-railroad-gothic">
			<Title />
			<div className="row gap-8">
				<a href="/">
					<p className="text-xl font-bold font-railroad-gothic">HOME</p>
				</a>
				<a href="/">
					<p className="text-xl font-bold font-railroad-gothic">WARRIORS</p>
				</a>
				<a href="/">
					<p className="text-xl font-bold font-railroad-gothic">HIGHLIGHTS</p>
				</a>
				<a href="/">
					<p className="text-xl font-bold font-railroad-gothic">FAQ</p>
				</a>
			</div>
			
		</nav>
	);
};

export { Navbar };
