import logger from '@/logger';
import { internalServerError } from '@/util/query';

const buildActionError = (pastAction: string, presentAction: string, err: unknown) => {
	logger.error(Error.isError(err) ? err : new Error(`Unexpected error \`${pastAction}\``));
	return internalServerError(`Failed to ${presentAction}.`);
};

export default buildActionError;
