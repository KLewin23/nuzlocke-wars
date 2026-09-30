import React from 'react';

import { Navbar } from '../molecules';

const BasicNavbar = () => (
	<Navbar
		links={{
			HOME: '/',
			WARRIORS: '/',
			HIGHLIGHTS: '/',
			FAQ: '/',
		}}
	/>
);

export { BasicNavbar };
