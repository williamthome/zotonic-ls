export function expectEqual<A, B>(a: A, b: B) {
    return expect(a).toEqual(b);
}

export function expectThrowException<Fn extends Promise<any> | void>(fn: Fn) {
    return fn instanceof Promise
        ? expect(fn).rejects.toThrow()
        : expect(fn).toThrow();
}
