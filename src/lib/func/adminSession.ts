import { auth } from '@/auth';
import { Role } from '@/db/authSchema';
import { headers } from 'next/headers';
import { type Either, leftOf } from '@/util/either';
import type { QueryFailureState } from '@/util/query';

const adminSession = async <T>(
	withSession: (session: typeof auth.$Infer.Session) => Promise<Either<QueryFailureState, T>>,
): Promise<Either<QueryFailureState, T>> => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	if (!session?.user)
		return leftOf({
			type: 'Unauthorized' as const,
		});
	if (session.user.role === Role.basic) return leftOf({ type: 'Forbidden' as const });
	return withSession(session);
};

export default adminSession;
