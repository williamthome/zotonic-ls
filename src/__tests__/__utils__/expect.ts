import { AnyFunction, AnyPromise } from '@/domain/types';

export function expectEqual<A, B>(a: A, b: B) {
    return expect(a).toEqual(b);
}

export function expectNotEqual<A, B>(a: A, b: B) {
    return expect(a).not.toEqual(b);
}

export function expectThrowException<Fn extends AnyFunction | AnyPromise>(
    fn: Fn,
) {
    return fn instanceof Promise
        ? expect(fn).rejects.toThrow()
        : expect(fn).toThrow();
}
