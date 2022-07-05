import { buildImageTagSnippetProvider } from '@/domain/snippets';
import { filesByWorkspaceSpy } from '@/__tests__/domain/__spies__';
import { expectNotThrowException } from '@/__tests__/__utils__';

describe('domain/snippets/providers/tags/image-tag-snippet-provider', () => {
    function makeSut() {
        const filesByWorkspace = filesByWorkspaceSpy();

        const sut = buildImageTagSnippetProvider({
            filesByWorkspace: filesByWorkspace.spy,
        });

        return {
            sut,
            filesByWorkspaceSpy: filesByWorkspace,
        };
    }

    describe('getSnippets', () => {
        it('should not throw', () => {
            const { sut } = makeSut();

            expectNotThrowException(sut.getSnippets);
        });
    });
});
