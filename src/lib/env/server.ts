import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		BETTER_AUTH_SECRET: z.string(),
		BASE_URL: z.string(),
	},
	runtimeEnv: process.env,
});

export { env };
