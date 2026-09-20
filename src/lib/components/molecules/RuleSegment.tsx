import { cn } from 'cnfast';
import Image from 'next/image';
import { match } from 'ts-pattern';
import { type RuleSegment, RuleSegmentColour } from '@/lib/type/rules';

interface Props {
	ruleSegmentData: RuleSegment;
	reverseHorizontalFlow: boolean;
}

const RuleSegment = ({ ruleSegmentData, reverseHorizontalFlow }: Props) => {
	const backgroundGradient = match(ruleSegmentData.colour)
		.with(RuleSegmentColour.Green, () => 'gradient-section-green-background')
		.with(RuleSegmentColour.Red, () => 'gradient-section-red-background')
		.with(RuleSegmentColour.Orange, () => 'gradient-section-orange-background')
		.with(RuleSegmentColour.Yellow, () => 'gradient-section-yellow-background')
		.exhaustive();

	console.log(backgroundGradient);

	return (
		<div
			className={cn(
				'px-gutters flex justify-between py-40',
				backgroundGradient,
				reverseHorizontalFlow ? 'flex-row-reverse' : 'flex-row',
			)}
		>
			<Image src={ruleSegmentData.image} alt={`icon for ${ruleSegmentData.title}`} />
			<div className="col w-3/5 gap-2.5">
				<h3 className="gradient-gold w-fit bg-clip-text text-5xl font-bold text-transparent">
					{ruleSegmentData.title}
				</h3>
				<div className="col gap-2.5 ">
					{ruleSegmentData.rules.map(rule => (
						<div className="row gap-4 items-center ml-10">
							<div className="gradient-gold h-5 w-5 rotate-45"/>
							<p className="text-white">{rule}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default RuleSegment;
