import 'dotenv/config';
import { env } from '@env/server';
import { defineConfig } from 'drizzle-kit';

import ca from './src/lib/db/ca.pem';

export default defineConfig({
	out: './drizzle',
	schema: ['./src/lib/db/draftSchema.ts', './src/lib/db/authSchema.ts'],
	dialect: 'postgresql',
	dbCredentials: {
		url: env.DATABASE_URL,
		ssl:
			env.VERCEL_ENV !== undefined ?
				{
					rejectUnauthorized: true,
					ca,
				}
			:	undefined,
	},
});
