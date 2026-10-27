import { isAPIError } from 'better-auth/api';
import { type QueryFailureState, badRequest, internalServerError } from '@/util/query';

const buildAuthError = (err: unknown, alternative: QueryFailureState) => {
	if (!isAPIError(err)) return alternative;

	if (err.status === 'BAD_REQUEST') return badRequest(err.message);
	if (err.status === 'FORBIDDEN') return { type: 'Forbidden' as const };
	if (err.status === 'UNAUTHORIZED') return { type: 'Unauthorized' as const };
	return internalServerError(err.message);
};

export default buildAuthError;
