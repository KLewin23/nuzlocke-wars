import Image from 'next/image';
import Icon from '@public/icon.png';
import TextLogo from '@public/TextLogo.png';

export default function Home() {
	return (
		<div className="col flex-1 items-center justify-center bg-linear-to-t from-[#242642] to-[#05041b] font-sans">
			<nav className="row w-full items-center justify-center gap-10 py-6">
				<div className="row max-w-lg gap-1">
					{/* <Image src={Icon} alt="Nuzlocke wars icon" height={40} /> */}
					{/* <Image src={TextLogo} alt="Nuzlocke wars logo" height={40} /> */}

          <p className="text-5xl text-[#ffcc03] drop-shadow-[0_4.2px_1.2px_#356abc]">Nuzlocke Wars</p>
				</div>
				<div className="row gap-5">
					<a href="/">
						<p className="text-3xl text-white">Home</p>
					</a>
					<a href="/">
						<p className="text-3xl text-white">Participants</p>
					</a>
					<a href="/">
						<p className="text-3xl text-white">Highlights</p>
					</a>
					<a href="/">
						<p className="text-3xl text-white">FAQ</p>
					</a>
				</div>
			</nav>
			<main className="col w-full max-w-3xl flex-1 items-center justify-between px-16 py-32 sm:items-start"></main>
		</div>
	);
}
