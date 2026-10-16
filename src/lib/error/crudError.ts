import logger from '@/logger';
import { match } from 'ts-pattern';
import { type QueryFailureState, internalServerError } from '@/util/query';

type Action = 'create' | 'read' | 'update' | 'delete';

const buildCRUDError = (action: Action, noun: string, err: unknown): QueryFailureState => {
	const pastDataAction = match(action)
		.with('create', () => 'insertion')
		.with('read', () => 'read')
		.with('delete', () => 'deletion')
		.with('update', () => 'modification')
		.exhaustive();

	const currentDataAction = match(action)
		.with('create', () => 'creating')
		.with('read', () => 'reading')
		.with('delete', () => 'deleting')
		.with('update', () => 'updating')
		.exhaustive();

	logger.error(
		Error.isError(err) ? err : (
			new Error(`Unhandled data ${pastDataAction} error occurred ${currentDataAction} a \`${noun}\``)
		),
	);
	return internalServerError(`Failed to ${action} ${noun}.`);
};

export default buildCRUDError;
