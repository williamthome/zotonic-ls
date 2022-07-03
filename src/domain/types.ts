export type AnyObject = Record<string, unknown>;

export type AnyFunction = (...args: any[]) => unknown;

export type AnyPromise = Promise<unknown>;

export type Args<T> = T extends (...args: Array<infer Args>) => unknown
    ? Args
    : [];
