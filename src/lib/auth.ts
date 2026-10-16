import { db } from '@/db/database';
import { env } from '@/env/server';
import { betterAuth } from 'better-auth';
import * as schema from '@/db/authSchema';
import { nextCookies } from 'better-auth/next-js';
import { username } from 'better-auth/plugins';
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';

const auth = betterAuth({
	advanced: {
		database: {
			joins: true,
		},
	},
	user: {
		additionalFields: {
			role: {
				type: ['super', 'admin', 'basic'],
				defaultValue: 'basic',
				required: true,
				input: true,
			},
		},
	},
	trustedOrigins: [env.BASE_URL],
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema,
	}),
	emailAndPassword: {
		enabled: true,
	},
	plugins: [username(), nextCookies()],
	rateLimit: {
		enabled: true,
		window: 60,
		max: 100,
	},
});

export { auth };
