import { buildMSnippetProvider } from '@/domain/snippets/providers/m-snippet-provider';
import { expectNotThrowException } from '@/__tests__/__utils__';

describe('domain/snippets/providers/m-snippet-provider', () => {
    function makeSut() {
        const sut = buildMSnippetProvider();

        return {
            sut,
        };
    }

    describe('getSnippets', () => {
        it('should not throw', () => {
            const { sut } = makeSut();

            expectNotThrowException(sut.getSnippets);
        });
    });
});
