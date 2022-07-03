import { buildSnippet } from '@/domain/snippet/snippet';
import { expectEqual } from '@/__tests__/__utils__';

describe('domain/snippet/snippet', () => {
    function makeSut() {
        const sut = buildSnippet({ label: 'foo' });

        return { sut };
    }

    describe('buildSnippet', () => {
        it('should build with full props', () => {
            const { sut } = makeSut();

            expectEqual(sut, {
                label: expect.any(String),
                body: expect.any(String),
                description: expect.any(String),
                documentation: expect.any(String),
                triggerCharacters: expect.any(Array),
            });
        });
    });
});
