import { clientEnv } from '@/lib/env/client';
import { createAuthClient } from 'better-auth/client';
import { usernameClient } from 'better-auth/client/plugins';

const authClient = createAuthClient({
	plugins: [usernameClient()],
	baseURL: clientEnv.NEXT_PUBLIC_BASE_URL,
});

export { authClient };
