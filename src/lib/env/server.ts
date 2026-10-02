import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

const env = createEnv({
	server: {
		DATABASE_URL: z.string(),
		BETTER_AUTH_SECRET: z.string(),
		BASE_URL: z.string(),
		NODE_ENV: z.union([z.literal('testing'), z.literal('development'),  z.literal('production')]),
	},
	runtimeEnv: process.env,
});

export { env };
