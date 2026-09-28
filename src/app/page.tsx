import Image from 'next/image';
import { Navbar } from '@molecules';
import { ruleset } from '@data/rules';
import { RuleSegment } from '@molecules';
import { Fragment } from 'react/jsx-runtime';
import { Header, StripedSeperator } from '@atoms';
import CandymanMainpage from '@public/CandymanMainpage.png';

const Home = () => {
	return (
		<div className="gradient-radial-purple">
			<Navbar />
			<main className="col">
				<div className="col h-[calc(100vh-76px)] w-full items-center pt-15 md:pt-40">
					<div className="col w-250 items-center xl:items-end">
						<Header className="font-rye gradient-red w-fit bg-clip-text text-transparent xl:mr-48">
							CANDYMAN&apos;S
						</Header>
						<Header className="gradient-gold w-fit bg-clip-text font-bold text-transparent">
							CARNIVAL
						</Header>
						<Image src={CandymanMainpage} alt="The candy man throwing a coin into a chest full of candy" className="max-w-80 md:max-w-lg self-auto xl:self-start mt-0 -ml-20 xl:-mt-24 "/>
					</div>
				</div>
				{ruleset.map((segment, segIndex) => (
					<Fragment key={`ruleSegment-${segment.title}-${segIndex}`}>
						{segIndex < ruleset.length ?
							<StripedSeperator keyPrefix={segment.title} />
						:	null}
						<RuleSegment ruleSegmentData={segment} reverseHorizontalFlow={segIndex % 2 !== 0} />
					</Fragment>
				))}
			</main>
		</div>
	);
};

export default Home;
