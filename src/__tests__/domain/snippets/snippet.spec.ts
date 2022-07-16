import { buildSnippet } from '@/domain/snippets';
import { expectAny, expectZObj } from '@/__tests__/__utils__';

describe('domain/snippet/snippet', () => {
    function makeSut() {
        const sut = buildSnippet({ label: 'foo' });

        return { sut };
    }

    describe('buildSnippet', () => {
        it('should build with full props', () => {
            const { sut } = makeSut();

            expectZObj(sut, {
                label: expectAny(String),
                body: expectAny(String),
                description: expectAny(String),
                documentation: expectAny(Object),
                triggerCharacters: expectAny(Array),
                command: undefined,
            });
        });
    });
});
