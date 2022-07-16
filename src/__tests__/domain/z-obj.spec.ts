import { isKindOf, zObj } from '@/domain/z-obj';
import { expectAny, expectZObj } from '@/__tests__/__utils__';

describe('domain/z-obj', () => {
    function makeSut() {
        const sut = zObj('foobar', {
            foo: 'bar',
            bar: () => 'baz',
        });

        return { sut };
    }

    describe('zObj', () => {
        it('should return with full props', () => {
            const { sut } = makeSut();

            expectZObj(sut, {
                foo: expectAny(String),
                bar: expectAny(Function),
            });
        });
    });

    describe('isKindOf', () => {
        it('should be kind of zObj', () => {
            const { sut } = makeSut();

            expect(isKindOf('foobar', sut));
        });
    });
});
