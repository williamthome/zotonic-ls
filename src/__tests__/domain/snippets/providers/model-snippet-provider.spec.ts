import { buildModelSnippetProvider } from '@/domain/snippets';
import { filesByGlobPatternSpy } from '@/__tests__/domain/__spies__';
import { expectNotThrowException } from '@/__tests__/__utils__';

describe('domain/snippets/providers/model-snippet-provider', () => {
    function makeSut() {
        const filesByGlobPattern = filesByGlobPatternSpy();

        const sut = buildModelSnippetProvider({
            filesByGlobPattern: filesByGlobPattern.spy,
            workspacesRoot: ['root'],
        });

        return {
            sut,
            filesByGlobPatternSpy: filesByGlobPattern,
        };
    }

    describe('getSnippets', () => {
        it('should not throw', () => {
            const { sut } = makeSut();

            expectNotThrowException(sut.getSnippets);
        });
    });
});
