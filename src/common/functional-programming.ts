import { AnyObject } from './types';

export function immutable<T extends AnyObject>(obj: T) {
    return Object.freeze(obj);
}

export function copy<T extends AnyObject>(obj: T) {
    return immutable({ ...obj });
}

export function transform<T extends AnyObject>(obj: T, overrides: Partial<T>) {
    return immutable({ ...obj, ...overrides });
}

export function merge<T1 extends AnyObject, T2 extends AnyObject>(
    obj1: T1,
    obj2: T2,
) {
    return immutable({ ...obj1, ...obj2 });
}
