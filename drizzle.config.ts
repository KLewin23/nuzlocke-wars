import 'dotenv/config';
import { env } from '@/env/server';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: ['./src/lib/db/authSchema.ts', './src/lib/db/draftSchema.ts'],
	dialect: 'postgresql',
	dbCredentials:
		'DATABASE_CONNECTION_URL' in env ?
			{
				url: env.DATABASE_CONNECTION_URL,
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
			},
});
