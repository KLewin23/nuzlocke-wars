interface Left<V> {
	_type: 'left';
	value: V;
}

interface Right<V> {
	_type: 'right';
	value: V;
}
``;

type Either<L, R> = Left<L> | Right<R>;

const leftOf = <V>(value: V): Left<V> => ({ _type: 'left', value });
const rightOf = <V>(value: V): Right<V> => ({ _type: 'right', value });

const eitherOr = <L, R>(promise: Promise<R>, or: (e: unknown) => L): Promise<Either<L, R>> =>
	promise.then(r => rightOf(r)).catch((e) =>leftOf(or(e)));

export {eitherOr, leftOf, rightOf}

export type { Left, Right, Either };
