import { type Either, leftOf, rightOf } from '../either';

// Query did not fail
interface QueryNonFailureState {
	type: string;
}

interface Success<D> extends QueryNonFailureState {
	type: 'Success';
	data: D;
}

interface Created<T> extends QueryNonFailureState {
	type: 'Created';
	data: T;
}

interface Rejected extends QueryNonFailureState {
	type: 'Rejected';
	reason: string;
}

const rejected = (reason: string): Rejected => ({
	type: 'Rejected',
	reason,
});

const successOr = <L, D>(promise: Promise<D>, or: (e: unknown) => L): Promise<Either<L, Success<D>>> =>
	promise
		.then(data =>
			rightOf({
				type: 'Success' as const,
				data,
			}),
		)
		.catch(e => leftOf(or(e)));

export { successOr, rejected };

export type { Success, Rejected, QueryNonFailureState, Created };
