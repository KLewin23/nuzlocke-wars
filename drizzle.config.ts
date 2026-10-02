import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { env } from '@env/server';
import { defineConfig } from 'drizzle-kit';


const certificate = fs
  .readFileSync(path.resolve(__dirname, './src/lib/db/ca.pem'))
  .toString();

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
