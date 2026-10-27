type ArrElement<ArrType> = ArrType extends ReadonlyArray<infer ElementType> ? ElementType : never;

type Entries<T> = Array<
	NonNullable<
		{
			[K in keyof T]: [K, NonNullable<T[Extract<keyof T, string>]>];
		}[keyof T]
	>
>;

export type { ArrElement, Entries };
