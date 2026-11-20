import { auth } from '@/auth/auth';
import { headers } from 'next/headers';
import { type Either, leftOf } from '@/util/either';
import type { Permissions } from '@/auth/permissions';
import type { QueryFailureState } from '@/util/query';
import { env } from '@/env/server';

const withAdminSession = async <T>(
	withSession: (session: typeof auth.$Infer.Session) => Promise<Either<QueryFailureState, T>>,
	permissions?: Permissions,
): Promise<Either<QueryFailureState, T>> => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user)
		return leftOf({
			type: 'Unauthorized' as const,
		});
	const hasPermission = await auth.api.userHasPermission({
		headers: await headers(),
		body: {
			userId: session?.user.id,
			role: 'admin',
			permissions: permissions ?? {},
		},
	});
	if (hasPermission.success === false || (!session.user.twoFactorEnabled && !env.SKIP_ADMIN_MFA))
		return leftOf({ type: 'Forbidden' as const });
	return withSession(session);
};

export default withAdminSession;
