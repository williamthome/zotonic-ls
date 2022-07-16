import { AnyFunction, AnyPromise } from '@/common/types';

export function expectEqual<A, B>(a: A, b: B) {
    return expect(a).toStrictEqual(b);
}

export function expectNotEqual<A, B>(a: A, b: B) {
    return expect(a).not.toStrictEqual(b);
}

export function expectBeArray<T>(arr: T) {
    return expect(arr).toStrictEqual(expect.any(Array));
}

// export function expectNotEmpty<T extends Array<unknown>>(arr: T) {
//     return expect(arr.length).toBeGreaterThan(0);
// }

export function expectThrowException<Fn extends AnyFunction | AnyPromise>(
    fn: Fn,
) {
    return fn instanceof Promise
        ? expect(fn).rejects.toThrow()
        : expect(fn).toThrow();
}

export function expectNotThrowException<Fn extends AnyFunction | AnyPromise>(
    fn: Fn,
) {
    return fn instanceof Promise
        ? expect(fn).rejects.not.toThrow()
        : expect(fn).not.toThrow();
}

export function expectInstanceOf<V, I>(value: V, instance: I) {
    return expect(value).toBeInstanceOf(instance);
}

export function expectAny<T>(value: T) {
    return expect.any(value);
}

export function expectZObj<A, B>(a: A, b: B) {
    expectEqual(a, {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __kind__: expectAny(String),
        ...b,
    });
}
