import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

const clientEnv = createEnv({
	clientPrefix: 'NEXT_PUBLIC',
	client: {
		NEXT_PUBLIC_BASE_URL: z.string(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL
	},
});

export { clientEnv };
