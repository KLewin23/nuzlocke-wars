import { match } from 'ts-pattern';

// Something has gone wrong.
interface Unauthorized {
	type: 'Unauthorized';
}

interface Forbidden {
	type: 'Forbidden';
}

interface NotFound {
	type: 'NotFound';
	message: string;
}
const notFound = (message: string): NotFound => ({
	type: 'NotFound',
	message,
});

interface BadRequest {
	type: 'BadRequest';
	cause: string;
}
const badRequest = (cause: string): BadRequest => ({
	type: 'BadRequest',
	cause,
});

interface InternalServerError {
	type: 'InternalServerError';
	message: string;
}
const internalServerError = (message: string): InternalServerError => ({
	type: 'InternalServerError',
	message,
});

type QueryFailureState = Unauthorized | Forbidden | BadRequest | NotFound | InternalServerError;

interface ReadableQueryFailure {
	title: string;
	description: string;
}

const readableQueryFailure = (queryFailure: QueryFailureState): ReadableQueryFailure =>
	match(queryFailure)
		.with({ type: 'BadRequest' }, failure => ({
			title: 'Unexpected error occoured.',
			description: failure.cause,
		}))
		.with({ type: 'Forbidden' }, () => ({
			title: 'Authentication Error.',
			description: 'User does not have permissions to complete action.',
		}))
		.with({ type: 'Unauthorized' }, () => ({
			title: 'Authentication Error.',
			description: 'User is not authenticated (logged in).',
		}))
		.with({ type: 'NotFound' }, failure => ({
			title: 'Not Found.',
			description: failure.message,
		}))
		.with({ type: 'InternalServerError' }, failure => ({
			title: 'Unexpected error occoured.',
			description: failure.message,
		}))
		.exhaustive();

export { internalServerError, badRequest, readableQueryFailure, notFound };

export type { InternalServerError, QueryFailureState };
