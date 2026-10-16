import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

const env = createEnv({
	server: {
		DATABASE_USERNAME: z.string(),
		DATABASE_PASSWORD: z.string(),
		DATABASE_NAME: z.string(),
		DATABASE_PORT: z.string().transform(s => parseInt(s, 10)),
		DATABASE_HOST: z.string(),
		DATABASE_CA_CERTIFICATE: z
			.string()
			.transform(s => Buffer.from(s, 'base64').toString())
			.optional(),
		BETTER_AUTH_SECRET: z.string(),
		BASE_URL: z.string(),
		VERCEL_ENV: z
			.union([z.literal('local'), z.literal('development'), z.literal('preview'), z.literal('production')])
			.optional(),
		ABLY_PUBLISH_API_KEY: z.string(),
		ABLY_SUBSCRIBE_API_KEY: z.string(),
	},
	runtimeEnv: process.env,
});

export { env };
