import { env } from '@/lib/env/server';
import { drizzle } from 'drizzle-orm/node-postgres';

import { authRelations } from './authSchema';
import { draftRelations } from './draftSchema';

export const db = drizzle({
	connection: {
		connectionString: env.DATABASE_URL,
	},
	relations: { ...authRelations, ...draftRelations },
});
