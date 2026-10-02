import 'dotenv/config';
import { env } from '@env/server';
import { defineConfig } from 'drizzle-kit';

console.log('CA_CERT_EXIST: ', typeof env.DB_CA_CERTIFICATE)

export default defineConfig({
	out: './drizzle',
	schema: ['./src/lib/db/draftSchema.ts', './src/lib/db/authSchema.ts'],
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
		ssl:
			env.DB_CA_CERTIFICATE !== undefined ?
				{
					rejectUnauthorized: true,
					ca: env.DB_CA_CERTIFICATE,
				}
			:	undefined,
	},
});
