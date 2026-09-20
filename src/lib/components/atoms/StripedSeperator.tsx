'use client';
import React from 'react';
import { useWindowSize } from '@hooks/index';

const StripedSeperator = () => {
	const { width } = useWindowSize();
	return (
		<div className="row bg-white">
			{Array.from(Array(Math.ceil(width / 80))).map(() => (
				<>
					<div className="bg-seperator-red h-2 w-10" />
					<div className="bg-seperator-white h-2 w-10" />
				</>
			))}
		</div>
	);
};

export default StripedSeperator;
