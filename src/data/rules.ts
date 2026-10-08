import Abacus from '@public/abacus.webp';
import Muk from '@public/Muk.png';
import MrMime from '@public/MrMime.png';
import ExampleBounty from '@public/example_bounty.png';
import { RuleSegmentColour, type Ruleset } from '@type/rules';

const ruleset: Ruleset = [
	{
		title: 'The Mercenary Draft',
		colour: RuleSegmentColour.Red,
		rules: [
			'Captains are provided with a set number of Candy Coins as the draft begins',
			'These coins are used to compete in an auction against each other for mercenary nuzlockers to compose their army',
			'Captains will bid the number of Candy Coins they are willing to spend to procure each player\'s services; the highest bidder wins, but captains cannot see their opponents\' offers until the bidding window closes!',
			'However, conserving some Candy Coins may also prove prudent, as they can be spent later to provide boons during...'
		],
		image: Muk,
	},
	{
		title: 'The Challenges',
		colour: RuleSegmentColour.Orange,
		rules: [
			'Each player and captain will take on exactly 1 of the 8 mysterious challenges prepared for them within the Platinum Kaizo Sinnoh region',
			'For each challenge, a cryptic keyword will be provided; it will be up to the teams to attempt to decipher them and determine where best to allocate their players, but also...',
			'Their Candy Coins, as any left over from the Mercenary Draft can be allocated to teammates to endow them with bonus held items!',
			'These challenges will look like no ordinary nuzlocking competition - A myriad of abilities will be tested both within and outside the game to accrue the points that will determine our victor, and along the way...'
		],
		image: MrMime,
	},
	{
		title: 'Bounties',
		colour: RuleSegmentColour.Yellow,
		rules: [
			'During their challenge, bolder players may choose to take on additional side-goals to be rewarded with additional bonuses',
			'These bonuses could take the form of extra points on top of their placement in the main challenge, or additional Candy Coins for their team\'s pot, to grant additional held item access for their subsequent teammates',
			'2 bounties will be available per challenge, and both, one or neither can be fulfilled',
		],
		image: ExampleBounty,
	},
	{
		title: 'HANG ON',
		colour: RuleSegmentColour.Green,
		rules: [
			'IM CHECKING MY PLUGIN... WAIT OK... IT SAID WE LOST',
			'Using a calc while competing in the challenge of the day is forbidden... For the player',
			'Their teammates? Well, there\'s only so much that can be done to regulate that kind of business. It\'s up to them how much they want to help their comrade with information...',
			'For nerds who want some more in-depth rules, click here.'
		],
		image: Abacus,
	},
];

export { ruleset };
