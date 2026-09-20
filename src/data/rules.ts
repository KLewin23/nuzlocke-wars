import Mew from '@public/Mew.png';
import Muk from '@public/Muk.png';
import MrMime from '@public/MrMime.png';
import RatatatHatter from '@public/RatatatHatter.png';
import { RuleSegmentColour, type Ruleset } from '@type/rules';

const ruleset: Ruleset = [
	{
		title: 'General Rules',
		colour: RuleSegmentColour.Red,
		rules: [
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		],
		image: Muk,
	},
	{
		title: 'General Rules2',
		colour: RuleSegmentColour.Orange,
		rules: [
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		],
		image: MrMime,
	},
	{
		title: 'General Rules3',
		colour: RuleSegmentColour.Orange,
		rules: [
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor',
		],
		image: RatatatHatter,
	},
	{
		title: 'General Rules4',
		colour: RuleSegmentColour.Green,
		rules: ['Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor'],
		image: Mew,
	},
];

export { ruleset };
