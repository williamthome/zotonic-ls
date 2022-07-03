import { immutable, copy, transform, merge } from '@/domain/fp';
import { expectEqual } from '../__utils__';

describe('domain/fp', () => {
    describe('immutable', () => {
        it('should be readonly', () => {
            const obj = immutable({ foo: 'bar' });
            const prop = Object.getOwnPropertyDescriptor(obj, 'foo');
            expectEqual(prop!.writable, false);
        });
    });

    describe('copy', () => {
        it('should copy a writable object', () => {
            const obj1 = { foo: 'bar' };
            const obj2 = copy(obj1);
            expectEqual(obj1, obj2);
        });

        it('should copy a readonly object', () => {
            const obj1 = immutable({ foo: 'bar' });
            const obj2 = copy(obj1);
            expectEqual(obj1, obj2);
        });
    });

    describe('transform', () => {
        it('should not transform the base object', () => {
            const obj1 = { foo: 'bar' };
            transform(obj1, { foo: 'baz' });
            expectEqual(obj1, { foo: 'bar' });
        });

        it('should override properties', () => {
            const obj1 = { foo: 'bar' };
            const obj2 = transform(obj1, { foo: 'baz' });
            expectEqual(obj2, { foo: 'baz' });
        });
    });

    describe('merge', () => {
        it('should not transform the base object', () => {
            const obj1 = { foo: 'bar' };
            const obj2 = { bar: 'baz' };
            merge(obj1, obj2);
            expectEqual(obj1, { foo: 'bar' });
            expectEqual(obj2, { bar: 'baz' });
        });

        it('should merge objects', () => {
            const obj1 = { foo: 'bar' };
            const obj2 = { bar: 'baz' };
            const obj3 = merge(obj1, obj2);
            expectEqual(obj3, { foo: 'bar', bar: 'baz' });
        });
    });
});
