import 'dotenv/config';
import { env } from '@env/server';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	out: './drizzle',
	schema: ['./src/lib/db/draftSchema.ts', './src/lib/db/authSchema.ts'],
	dialect: 'postgresql',
	dbCredentials: {
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
