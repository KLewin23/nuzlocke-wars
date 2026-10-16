// Something has gone wrong.
interface Unauthorized {
	type: 'Unauthorized';
}

interface Forbidden {
	type: 'Forbidden';
}

interface BadRequest {
    type: 'BadRequest'
	cause: string
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

type QueryFailureState = Unauthorized | Forbidden | BadRequest | InternalServerError;

export { internalServerError, badRequest };

export type { InternalServerError, QueryFailureState };
