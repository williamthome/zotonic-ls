// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

export type AnyArray<T = Any> = Array<T>;

export type AnyObject<T = Any> = Record<string, T>;

export type AnyFunction<T = Any> = (...args: AnyArray) => T;

export type AnyPromise<T = Any> = Promise<T>;

export type AnyPromiseable<T = Any> = (...args: AnyArray) => AnyPromise<T>;

export type Args<T> = T extends (...args: Array<infer Args>) => Any ? Args : [];

export type Return<T extends AnyFunction> = ReturnType<T> extends Promise<
    infer R
>
    ? R
    : ReturnType<T>;
