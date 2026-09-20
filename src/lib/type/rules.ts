import { StaticImageData } from 'next/image';

enum RuleSegmentColour {
	Red = 'Red',
	Yellow = 'Yellow',
	Orange = 'Orange',
	Green = 'Green',
}

interface RuleSegment {
	title: string;
	colour: RuleSegmentColour;
	rules: Array<string>;
	image: StaticImageData;
}

type Ruleset = Array<RuleSegment>;

export type { Ruleset, RuleSegment };
export { RuleSegmentColour };
