import type { Entries } from '@/type/util';

const entries = <T extends object>(object: T): Entries<T> => Object.entries(object) as Entries<T>;

const keys = Object.keys as <T>(o: T) => Array<Extract<keyof T, string>>;

const values = Object.values as <T>(o: T) => Array<NonNullable<T[Extract<keyof T, string>]>>;

export { entries, keys, values };
