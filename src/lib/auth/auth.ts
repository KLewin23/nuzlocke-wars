//NOTE: path aliases don't work in the auth cli
import { betterAuth } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { username } from 'better-auth/plugins/username';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { admin as adminPlugin } from 'better-auth/plugins/admin';
import { drizzleAdapter } from '@better-auth/drizzle-adapter/relations-v2';

import { db } from '../db/database';
import { env } from '../env/server';
import * as schema from '../db/authSchema';
import { ac, admin, user } from './permissions';

const auth = betterAuth({
	advanced: {
		database: {
			joins: true,
		},
	},
	baseURL: {
		allowedHosts: ['localhost:3000', '*.vercel.app'],
		fallback: env.BASE_URL,
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
	plugins: [
		username({
			maxUsernameLength: 16,
		}),
		twoFactor(),
		adminPlugin({ ac, roles: { admin, user } }),
		nextCookies(),
	],
	rateLimit: {
		enabled: env.VERCEL_ENV === 'local' || env.NODE_ENV === 'test' ? false : true,
		window: 60,
		max: 100,
	},
});

export { auth };
