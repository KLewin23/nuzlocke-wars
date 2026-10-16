import Image from 'next/image';
import { ruleset } from '@data/rules';
import { Fragment } from 'react/jsx-runtime';
import BasicNavbar from '@/organisms/BasicNavbar';
import { homepageContent } from '@/data/homepage';
import  Header from '@/atoms/typography/Header';
import { RuleSegment } from '@/molecules/RuleSegment';
import { StripedSeperator } from '@/atoms/StripedSeperator';
import CandymanMainpage from '@public/CandymanMainpage.png';

const Home = () => (
	<div className="gradient-radial-purple">
		<BasicNavbar />
		<main className="col">
			<div className="col h-[calc(100vh-76px)] w-full items-center pt-15 md:pt-40">
				<div className="col w-250 items-center xl:items-end">
					<Header className="font-rye gradient-red w-fit bg-clip-text text-transparent xl:mr-48">
						CANDYMAN&apos;S
					</Header>
					<Header className="gradient-gold w-fit bg-clip-text font-bold text-transparent">CARNIVAL</Header>
					<div className="row mt-0 -ml-20 justify-between self-auto xl:-mt-24 xl:self-start">
						<Image
							loading="eager"
							src={CandymanMainpage}
							alt="The candy man throwing a coin into a chest full of candy"
							className="max-w-80 md:max-w-lg"
						/>
						<div className="col gap-2 self-center">
							{homepageContent.description.map(line => (
								<div key={line} className="row ml-10 items-center gap-4">
									<div className="gradient-gold min-h-5 min-w-5 rotate-45" />
									<p className="text-lg text-white">{line}</p>
								</div>
							))}
						</div>
					</div>
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

export default Home;
