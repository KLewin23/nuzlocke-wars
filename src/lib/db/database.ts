import { env } from '@/env/server';
import { drizzle } from 'drizzle-orm/node-postgres';

import relations from './relations';

export const db = drizzle({
	connection: {
		database: env.DATABASE_NAME,
		host: env.DATABASE_HOST,
		password: env.DATABASE_PASSWORD,
		port: env.DATABASE_PORT,
		user: env.DATABASE_USERNAME,
		ssl: env.DATABASE_CA_CERTIFICATE !== undefined ? {
			rejectUnauthorized: true,
			ca: env.DATABASE_CA_CERTIFICATE,
		} : undefined
	},
	relations,
});
