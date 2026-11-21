import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import { type Either, leftOf } from '@/util/either';
import type { QueryFailureState } from '@/util/query';
import { env } from '@/env/server';

const withSession = async <T>(
	withSession: (session: typeof auth.$Infer.Session) => Promise<Either<QueryFailureState, T>>,
): Promise<Either<QueryFailureState, T>> => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user) return leftOf({ type: 'Unauthorized' as const });
	if (session.user.role === 'admin' && (!session.user.twoFactorEnabled && !env.SKIP_ADMIN_MFA)) return leftOf({ type: 'Forbidden' });
	return withSession(session);
};

export default withSession;
