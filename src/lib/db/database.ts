import { env } from '@/lib/env/server';
import { drizzle } from 'drizzle-orm/node-postgres';

import { authRelations } from './authSchema';
import { draftRelations } from './draftSchema';
import ca from './ca.pem'

export const db = drizzle({
	connection: {
		connectionString: env.DATABASE_URL,
		ssl: env.NODE_ENV === 'production' ? {
			rejectUnauthorized: true,
			ca
		} : undefined
	},
	relations: { ...authRelations, ...draftRelations },
});
