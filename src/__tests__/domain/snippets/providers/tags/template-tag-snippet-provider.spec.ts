import { buildTemplateTagSnippetProvider } from '@/domain/snippets/providers/tags/template-tag-snippet-provider';
import { filesByGlobPatternSpy } from '@/__tests__/domain/__spies__';
import { expectNotThrowException } from '@/__tests__/__utils__';

describe('domain/snippets/providers/tags/template-tag-snippet-provider', () => {
    function makeSut() {
        const filesByGlobPattern = filesByGlobPatternSpy();

        const sut = buildTemplateTagSnippetProvider({
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
