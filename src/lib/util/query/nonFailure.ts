import { type Either, leftOf, rightOf } from '../either';

// Query did not fail
interface QueryNonFailureState {
	type: string;
}

interface Success<D = undefined> extends QueryNonFailureState {
	type: 'Success';
	data: D;
}

const successOr = <L, D, B extends boolean = true>(
	promise: Promise<D>,
	or: (e: unknown) => L,
	ignoreReturn: B = true as B,
): Promise<Either<L, Success<B extends true ? undefined : D>>> =>
	promise
		.then(data =>
			rightOf({
				type: 'Success' as const,
				data: (ignoreReturn === true ? undefined : data) as B extends true ? undefined : D,
			}),
		)
		.catch(e => leftOf(or(e)));

export { successOr };

export type { Success, QueryNonFailureState };
