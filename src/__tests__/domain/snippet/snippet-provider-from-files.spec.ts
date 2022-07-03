import { buildSnippetProviderFromFiles } from '@/domain/snippet/snippet-provider-from-files';
import { expectEqual, expectThrowException } from '@/__tests__/__utils__';
import { filesByWorkspaceSpy, transformSnippetSpy } from '../__spies__';

describe('domain/snippet/snippet-provider-from-files', () => {
    function makeSut() {
        const transformSnippet = transformSnippetSpy();
        const filesByWorkspace = filesByWorkspaceSpy();

        const sut = buildSnippetProviderFromFiles({
            regex: /foo/,
            extensions: ['baz'],
            workspacesRoot: ['apps'],
            workspaces: [['priv', 'lib'], ['src']],
            triggerCharacters: ['.'],
            transformSnippet: transformSnippet.spy,
            filesByWorkspace: filesByWorkspace.spy,
        });

        return {
            sut,
            transformSnippetSpy: transformSnippet,
            filesByWorkspaceSpy: filesByWorkspace,
        };
    }

    describe('buildSnippetProviderFromFiles', () => {
        it('should build with full props', () => {
            const { sut } = makeSut();

            expectEqual(sut, {
                regex: expect.any(RegExp),
                triggerCharacters: expect.any(Array),
                getSnippets: expect.any(Function),
                flush: expect.any(Function),
            });
        });
    });
});
