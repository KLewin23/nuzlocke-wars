import { db } from '@/db/database';
import { env } from '@/env/server';
import { betterAuth } from 'better-auth';
import * as schema from '@/db/authSchema';
import { nextCookies } from 'better-auth/next-js';
import { username } from 'better-auth/plugins/username';
import { admin as adminPlugin } from 'better-auth/plugins/admin';
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';

import { ac, admin, user } from './permissions';

const auth = betterAuth({
	advanced: {
		database: {
			joins: true,
		},
	},
	user: {
		deleteUser: {
			enabled: true,
		},
		additionalFields: {
			role: {
				type: ['admin', 'user'],
				defaultValue: 'user',
				required: true,
				input: true,
			},
			username: { type: 'string', required: true },
		},
	},
	trustedOrigins: [env.BASE_URL],
	database: drizzleAdapter(db, {
		provider: 'pg',
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignIn: false,
	},
	plugins: [username(), nextCookies(), adminPlugin({ ac, roles: { admin, user } })],
	rateLimit: {
		enabled: true,
		window: 60,
		max: 100,
	},
});

export { auth };
