import type { Either } from '../either';
import type { QueryFailureState } from './failure';
import type { QueryNonFailureState } from './nonFailure';

type QueryState = Either<QueryFailureState, QueryNonFailureState>;

export type { QueryState };

export * from './failure';
export * from './nonFailure';
