import { Pool } from 'pg';
import { env } from '@/env/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { attachDatabasePool } from '@vercel/functions';

import relations from './relations';

const pool = new Pool({
	database: env.DATABASE_NAME,
	host: env.DATABASE_HOST,
	password: env.DATABASE_PASSWORD,
	port: env.DATABASE_PORT,
	user: env.DATABASE_USERNAME,
	ssl:
		env.DATABASE_CA_CERTIFICATE !== undefined ?
			{
				rejectUnauthorized: true,
				ca: env.DATABASE_CA_CERTIFICATE,
			}
		:	undefined,
	min: 1,
	idleTimeoutMillis: 5000
});

attachDatabasePool(pool);

export const db = drizzle({
	client: pool,
	relations,
});
