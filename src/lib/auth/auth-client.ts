import { clientEnv } from '@/env/client';
import { createAuthClient } from 'better-auth/react';
import { adminClient, inferAdditionalFields, usernameClient } from 'better-auth/client/plugins';

import type { auth } from './auth';
import { ac, admin, user } from './permissions';

const authClient = createAuthClient({
	plugins: [
		usernameClient(),
		inferAdditionalFields<typeof auth>(),
		adminClient({
			ac,
			roles: {
				admin,
				user,
			},
		}),
	],
	baseURL: clientEnv.NEXT_PUBLIC_BASE_URL,
});

export { authClient };
