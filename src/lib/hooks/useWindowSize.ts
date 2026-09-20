'use client';

import { useEffect, useState } from 'react';

interface WindowSize {
	width: number;
	height: number;
}

const useWindowSize = (): WindowSize => {
	const [windowSize, setWindowSize] = useState<WindowSize>(() => {
		if (typeof window !== 'undefined')
			// Only run on client side
			return {
				width: window.innerWidth,
				height: window.innerHeight,
			};

		return {
			width: 0,
			height: 0,
		};
	});

	useEffect(() => {
		if (typeof window === 'undefined')
			// Only run on client side
			return;

		const handleResize = () => {
			setWindowSize({
				width: window.innerWidth,
				height: window.innerHeight,
			});
		};

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Call handler right away so state gets updated with initial window size
		handleResize();

		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	return windowSize;
};

export { useWindowSize };
