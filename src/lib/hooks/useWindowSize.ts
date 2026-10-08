'use client';

import { useEffect, useState } from 'react';

interface WindowSize {
	width: number;
	height: number;
	isClient: boolean;
}

const useWindowSize = (): WindowSize => {
	const [windowSize, setWindowSize] = useState<WindowSize>(() => {
		if (typeof window !== 'undefined')
			return {
				width: window.innerWidth,
				height: window.innerHeight,
				isClient: false
			};

		return {
			width: 0,
			height: 0,
			isClient: false
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
				isClient: true
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

export default useWindowSize;
