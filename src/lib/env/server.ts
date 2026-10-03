import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

const env = createEnv({
	server: {
		DATABASE_USERNAME: z.string(),
		DATABASE_PASSWORD: z.string(),
		DATABASE_NAME: z.string(),
		DATABASE_PORT:  z.string().transform(s => parseInt(s, 10)),
		DATABASE_HOST: z.string(),
		DATABASE_CA_CERTIFICATE: z.string().optional(),
		BETTER_AUTH_SECRET: z.string(),
		BASE_URL: z.string(),
		NODE_ENV: z.union([z.literal('testing'), z.literal('development'), z.literal('production')]),
		VERCEL_ENV: z.union([z.literal('development'), z.literal('preview'), z.literal('production')]).optional(),
	},
	runtimeEnv: process.env,
});

export { env };
