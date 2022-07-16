import { mGetExpressions } from '@/domain/snippets/helpers/model-helper';
import { expectAny, expectEqual } from '@/__tests__/__utils__';

describe('domain/snippets/helpers/model-helper', () => {
    describe('mGetExpressions', () => {
        function makeSut() {
            const sut = mGetExpressions({
                filePath: __filename,
                model: 'foo',
            });

            return {
                sut,
            };
        }

        it('should build with full props', () => {
            const { sut } = makeSut();

            expectEqual(sut, expectAny(Promise));
        });
    });
});
