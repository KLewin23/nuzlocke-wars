import type { StaticImageData } from 'next/image';

enum RuleSegmentColour {
	Red = 'Red',
	Yellow = 'Yellow',
	Orange = 'Orange',
	Green = 'Green',
}

interface Link {
	text: string;
	url:string
}

type Line = Array<string | Link>

interface RuleSegment {
	title: string;
	colour: RuleSegmentColour;
	rules: Array<string | Line>;
	image: StaticImageData;
}

type Ruleset = Array<RuleSegment>;

export type { Ruleset, RuleSegment, Line };
export { RuleSegmentColour };
