import type { Either } from '../either';
import type { QueryFailureState } from './failure';
import type { QueryNonFailureState } from './nonFailure';

type QueryState<
	QFS extends QueryFailureState = QueryFailureState,
	QNFS extends QueryNonFailureState = QueryNonFailureState,
> = Either<QFS, QNFS>;

type QueryStateWithFailure<QFS extends QueryFailureState> = QueryState<QFS, QueryNonFailureState>;
type QueryStateWithNonFailure<QNFS extends QueryNonFailureState> = QueryState<QueryFailureState, QNFS>;

export type { QueryState, QueryStateWithFailure, QueryStateWithNonFailure };

export * from './failure';
export * from './nonFailure';
