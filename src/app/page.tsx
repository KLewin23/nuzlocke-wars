import { Navbar } from '@molecules';
import { ruleset } from '@data/rules';
import RuleSegment from '@/lib/components/molecules/RuleSegment';
import StripedSeperator from '@/lib/components/atoms/StripedSeperator';
import { Fragment } from 'react/jsx-runtime';

export default function Home() {
	return (
		<div className="gradient-radial-purple">
			<Navbar />
			<main className="col">
				<div className="h-[calc(100vh-76px)] w-full items-center pt-40">
					<div className="col items-end px-80">
						<h1 className="font-rye gradient-red mr-48 w-fit bg-clip-text text-9xl text-transparent">
							CANDYMAN&apos;S
						</h1>
						<h1 className="gradient-gold w-fit bg-clip-text text-9xl font-bold text-transparent">
							CARNIVAL
						</h1>
					</div>
				</div>
				{ruleset.map((segment, segIndex) => (
					<Fragment key={`ruleSegment-${segment.title}-${segIndex}`}>
						{segIndex < ruleset.length ?
							<StripedSeperator />
						:	null}
						<RuleSegment ruleSegmentData={segment} reverseHorizontalFlow={segIndex % 2 !== 0} />
					</Fragment>
				))}
			</main>
		</div>
	);
}
