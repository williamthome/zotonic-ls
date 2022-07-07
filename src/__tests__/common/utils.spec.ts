import {
    minZero,
    joinWithBreakLine,
    formatToGlobPattern,
    filenameFrom,
} from '@/common/utils';
import { expectEqual } from '../__utils__';

describe('common/utils', () => {
    describe('minZero', () => {
        it('should return zero', () => {
            expectEqual(minZero(-1), 0);
        });

        it('should return the value', () => {
            expectEqual(minZero(1), 1);
        });
    });

    describe('joinWithBreakLine', () => {
        it('should return the same value when is string', () => {
            expectEqual(joinWithBreakLine('foo'), 'foo');
        });

        it('should join when is array', () => {
            expectEqual(joinWithBreakLine(['foo', 'bar']), 'foo\nbar');
        });
    });

    describe('formatToGlobPattern', () => {
        it('should not embrace string', () => {
            expectEqual(formatToGlobPattern('foo'), 'foo');
        });

        it('should not embrace array with one element', () => {
            expectEqual(formatToGlobPattern(['foo']), 'foo');
        });

        it('should embrace array', () => {
            expectEqual(formatToGlobPattern(['foo', 'bar']), '{foo,bar}');
        });
    });

    describe('filenameFrom', () => {
        [
            'foo',
            'foo.bar',
            'foo.bar.baz',
            'fizz/foo',
            'fizz/foo.bar',
            '\\fizz\\foo',
            '\\fizz\\foo.bar',
        ].forEach((path) => {
            it('should return foo as file name', () => {
                const filename = filenameFrom(path);
                expectEqual(filename, 'foo');
            });
        });

        it('should return empty if empty path', () => {
            const filename = filenameFrom('');
            expectEqual(filename, '');
        });
    });
});
