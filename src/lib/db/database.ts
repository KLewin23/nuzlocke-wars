import { Pool } from 'pg';
import { env } from '@/env/server';
import { drizzle } from 'drizzle-orm/node-postgres';
import { attachDatabasePool } from '@vercel/functions';

import relations from './relations';

const pool = new Pool({
	...('DATABASE_CONNECTION_URL' in env ?
		{
			connectionString: env.DATABASE_CONNECTION_URL,
		}
	:	{
			host: env.DATABASE_HOST,
			port: env.DATABASE_PORT,
			user: env.DATABASE_USERNAME,
			password: env.DATABASE_PASSWORD,
			database: env.DATABASE_NAME,
			ssl:
				env.DATABASE_CA_CERTIFICATE !== undefined ?
					{
						rejectUnauthorized: true,
						ca: env.DATABASE_CA_CERTIFICATE,
					}
				:	undefined,
		}),
	min: 1,
	idleTimeoutMillis: 5000,
});

attachDatabasePool(pool);

export const db = drizzle({
	client: pool,
	relations,
});
