import { buildSnippetProviderFromFiles } from '@/domain/snippet/snippet-provider-from-files';
import {
    expectAny,
    expectEqual,
    expectThrowException,
} from '@/__tests__/__utils__';
import { filesByWorkspaceSpy, transformSnippetSpy } from '../__spies__';

describe('domain/snippet/snippet-provider-from-files', () => {
    function makeSut() {
        const transformSnippet = transformSnippetSpy();
        const filesByWorkspace = filesByWorkspaceSpy();

        const extensions = ['baz'];
        const workspacesRoot = ['apps'];
        const workspaces = [['priv', 'lib'], ['src']];

        const sut = buildSnippetProviderFromFiles({
            regex: /foo/,
            extensions,
            workspacesRoot,
            workspaces,
            triggerCharacters: ['.'],
            transformSnippet: transformSnippet.spy,
            filesByWorkspace: filesByWorkspace.spy,
        });

        return {
            sut,
            extensions,
            workspacesRoot,
            workspaces,
            transformSnippetSpy: transformSnippet,
            filesByWorkspaceSpy: filesByWorkspace,
        };
    }

    describe('buildSnippetProviderFromFiles', () => {
        it('should build with full props', () => {
            const { sut } = makeSut();

            expectEqual(sut, {
                regex: expectAny(RegExp),
                triggerCharacters: expectAny(Array),
                getSnippets: expectAny(Function),
                flush: expectAny(Function),
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

    describe('filesByWorkspace', () => {
        it('should be called once', async () => {
            const { sut, filesByWorkspaceSpy } = makeSut();

            await sut.getSnippets();

            expectEqual(filesByWorkspaceSpy.calledOnce, true);
        });

        it('should be called with right args', () => {
            const {
                sut,
                extensions,
                workspacesRoot,
                workspaces,
                filesByWorkspaceSpy,
            } = makeSut();

            sut.getSnippets();

            expectEqual(filesByWorkspaceSpy.args, {
                extensions,
                workspacesRoot,
                workspaces,
                allowDuplicates: false,
            });
        });

        it('should throw if throws', () => {
            const { sut, filesByWorkspaceSpy } = makeSut();

            filesByWorkspaceSpy.throwException = true;

            expectThrowException(sut.getSnippets());
        });
    });
});
