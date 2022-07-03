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

    describe('transformSnippet', () => {
        it('should be called same as snippets length', async () => {
            const { sut, transformSnippetSpy } = makeSut();

            const snippets = await sut.getSnippets();

            expectEqual(transformSnippetSpy.calledTimes, snippets.length);
        });

        it('should be called with right args', () => {
            const { sut, transformSnippetSpy } = makeSut();

            sut.getSnippets();

            expectEqual(transformSnippetSpy.args, undefined);
        });

        it('should throw if throws', () => {
            const { sut, transformSnippetSpy } = makeSut();

            transformSnippetSpy.throwException = true;

            expectThrowException(sut.getSnippets());
        });
    });
});
