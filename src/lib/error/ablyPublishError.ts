import logger from '@/logger';
import type { AblyEvent } from '@/type/ably';
import { internalServerError } from '@/util/query';

const buildAblyPublishError = (event: AblyEvent, err: unknown) => {
	logger.error(Error.isError(err) ? err : new Error(`Unexpected error publishing ably event \`${event}\``));
	return internalServerError(`Failed to publish ably event ${event}.`);
};

export default buildAblyPublishError;
