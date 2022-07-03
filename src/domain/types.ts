export type AnyObject = Record<string, unknown>;

export type AnyFunction = (...args: []) => unknown;

export type Args<T> = T extends (...args: Array<infer Args>) => unknown
    ? Args
    : [];
