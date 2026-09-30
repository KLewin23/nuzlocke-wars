import { env } from '@/lib/env/server';
import { drizzle } from 'drizzle-orm/node-postgres';

import { authRelations } from './schema';

export const db = drizzle({
	connection: {
		connectionString: env.DATABASE_URL,
	},
	relations: { ...authRelations },
});
