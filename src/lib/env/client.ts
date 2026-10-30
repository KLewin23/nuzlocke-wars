import { z } from 'zod';
import { createEnv } from '@t3-oss/env-core';

const clientEnv = createEnv({
	clientPrefix: 'NEXT_PUBLIC',
	client: {
		NEXT_PUBLIC_BASE_URL: z.string(),
		NEXT_PUBLIC_VERCEL_ENV: z.union([z.literal('local'),z.literal('development'), z.literal('preview'), z.literal('production')]),
		NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z.string(),
	},
	runtimeEnv: {
		NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
		NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV,
		NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
	},
});

export { clientEnv };
