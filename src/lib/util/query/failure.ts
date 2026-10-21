import { toast } from 'sonner';
import { match } from 'ts-pattern';
import type { TransitionStartFunction } from 'react';

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

interface Rejected {
	type: 'Rejected';
	reason: string;
}

const rejected = (reason: string): Rejected => ({
	type: 'Rejected',
	reason,
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

type QueryFailureState = Unauthorized | Forbidden | BadRequest | NotFound | Rejected | InternalServerError;

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
		.with({ type: 'Rejected' }, failure => ({
			title: 'Rejected.',
			description: failure.reason,
		}))
		.with({ type: 'InternalServerError' }, failure => ({
			title: 'Unexpected error occoured.',
			description: failure.message,
		}))
		.exhaustive();

const readableFromFailureType = (queryFailureType: QueryFailureState['type']): string =>
	match(queryFailureType)
		.with('BadRequest', () => 'Unexpected error occoured.')
		.with('Forbidden', () => 'Authentication Error.')
		.with('Unauthorized', () => 'Authentication Error.')
		.with('NotFound', () => 'Not Found.')
		.with('Rejected', () => 'Rejected.')
		.with('InternalServerError', () => 'Unexpected error occoured.')
		.exhaustive();

const failureAsTransition = (failureState: QueryFailureState, startTransitionFn: TransitionStartFunction) =>
	startTransitionFn(() => {
		const failure = readableQueryFailure(failureState);
		toast(failure.title, { description: failure.description });
	});

export {
	internalServerError,
	badRequest,
	readableQueryFailure,
	notFound,
	failureAsTransition,
	rejected,
	readableFromFailureType,
};

export type { InternalServerError, QueryFailureState };
