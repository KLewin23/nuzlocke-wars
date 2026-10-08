'use client';

import { Fragment } from 'react';
import useWindowSize from '@hooks/useWindowSize';

interface Props {
	keyPrefix: string;
}

const StripedSeperator = ({ keyPrefix }: Props) => {
	const { isClient, width } = useWindowSize();
	return (
		<div className="row bg-white">
			{isClient &&
				Array.from(Array(Math.max(Math.ceil(width / 80), 1))).map((_, index) => (
					<Fragment key={`${keyPrefix}-${index}`}>
						<div className="bg-seperator-red h-2 w-10" />
						<div className="bg-seperator-white h-2 w-10" />
					</Fragment>
				))}
		</div>
	);
};

export { StripedSeperator };
