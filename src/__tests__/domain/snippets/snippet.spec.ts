import { buildSnippet } from '@/domain/snippets';
import { expectAny, expectEqual } from '@/__tests__/__utils__';

describe('domain/snippet/snippet', () => {
    function makeSut() {
        const sut = buildSnippet({ label: 'foo' });

        return { sut };
    }

    describe('buildSnippet', () => {
        it('should build with full props', () => {
            const { sut } = makeSut();

            expectEqual(sut, {
                label: expectAny(String),
                body: expectAny(String),
                description: expectAny(String),
                documentation: expectAny(Object),
                triggerCharacters: expectAny(Array),
            });
        });
    });
});
