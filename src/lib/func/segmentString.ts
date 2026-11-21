import type { ArrElement } from '@/type/util';
import { type Option, none, someOf } from '@/util/option';

type SegmentMap<ES extends Array<string>> = Record<ArrElement<ES>, Option<string>>;

const segmentString = <ES extends Array<ArrElement<A>>, A extends Array<string>>(
	string: string,
	delimiter: string,
	expectedSegments: ES,
): SegmentMap<ES> => {
	const initialResponse = expectedSegments.reduce((acc, item) => ({ ...acc, [item]: none }), {} as SegmentMap<ES>);
	if (string.length === 0 || expectedSegments.length === 0) return initialResponse;

	const processCharacter = (
		string: string,
		segmentMap: SegmentMap<ES>,
		del: string,
		segments: Array<ArrElement<A>>,
		stringCursor = 0,
	): SegmentMap<ES> => {
		const nextSegment = segments.at(0);
		const targetChar = string.at(stringCursor);
		if (nextSegment === undefined) return segmentMap;

		if (targetChar === undefined || targetChar === del) {
			const newSegMap = {
				...segmentMap,
				[nextSegment]: stringCursor === 0 ? none : someOf(string.slice(0, stringCursor)),
			};
			return stringCursor === string.length ?
					newSegMap
				:	processCharacter(string.slice(stringCursor + 1), newSegMap, del, segments.slice(1), 0);
		}
		return processCharacter(string, segmentMap, del, segments, stringCursor + 1);
	};

	return processCharacter(string, initialResponse, delimiter, expectedSegments);
};

export default segmentString;
