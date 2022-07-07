import { File } from '@/domain/files';
import { buildSnippetProviderFromFiles } from '@/domain/snippets/snippet-provider-from-files';
import {
    expectAny,
    expectBeArray,
    expectEqual,
    expectThrowException,
} from '@/__tests__/__utils__';
import {
    filenameRegexByWorkspaceSpy,
    filesByGlobPatternSpy,
    transformSnippetSpy,
} from '../__spies__';

describe('domain/snippet/snippet-provider-from-files', () => {
    function makeSut() {
        const transformSnippet = transformSnippetSpy();
        const filenameRegexByWorkspace = filenameRegexByWorkspaceSpy();
        const filesByGlobPattern = filesByGlobPatternSpy();

        const extensions = ['baz'];
        const workspacesRoot = ['apps'];
        const workspaces = [['priv', 'lib'], ['src']];

        const sut = buildSnippetProviderFromFiles({
            regex: /foo/,
            extensions,
            workspaces,
            triggerCharacters: ['.'],
            workspacesRoot: ['root'],
            transformSnippet: transformSnippet.spy,
            filenameRegexByWorkspace: filenameRegexByWorkspace.spy,
            filesByGlobPattern: filesByGlobPattern.spy,
        });
        filenameRegexByWorkspace;

        return {
            sut,
            extensions,
            workspacesRoot,
            workspaces,
            transformSnippetSpy: transformSnippet,
            filenameRegexByWorkspaceSpy: filenameRegexByWorkspace,
            filesByGlobPatternSpy: filesByGlobPattern,
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

    describe('filenameRegexByWorkspace', () => {
        it('should be called same as files length', async () => {
            const { sut, filenameRegexByWorkspaceSpy, filesByGlobPatternSpy } =
                makeSut();

            await sut.getSnippets();

            const files = await filesByGlobPatternSpy.value;
            expectBeArray(files);

            const filesLength = (files as Array<File>).length;
            expectEqual(filenameRegexByWorkspaceSpy.calledTimes, filesLength);
        });

        it('should be called with right args', async () => {
            const { sut, filenameRegexByWorkspaceSpy } = makeSut();

            await sut.getSnippets();

            expectEqual(filenameRegexByWorkspaceSpy.args, {
                workspace: 'priv\\/lib|src',
            });
        });

        it('should throw if throws', () => {
            const { sut, filenameRegexByWorkspaceSpy } = makeSut();

            filenameRegexByWorkspaceSpy.throwException = true;

            expectThrowException(sut.getSnippets());
        });
    });

    describe('filesByGlobPatternSpy', () => {
        it('should be called once', () => {
            const { sut, filesByGlobPatternSpy } = makeSut();

            sut.getSnippets();

            expectEqual(filesByGlobPatternSpy.calledOnce, true);
        });

        it('should be called with right args', () => {
            const { sut, filesByGlobPatternSpy } = makeSut();

            sut.getSnippets();

            expectEqual(filesByGlobPatternSpy.args, {
                globPattern: 'root/**/{priv/lib,src}/**/*.baz',
            });
        });

        it('should throw if throws', () => {
            const { sut, filesByGlobPatternSpy } = makeSut();

            filesByGlobPatternSpy.throwException = true;

            expectThrowException(sut.getSnippets());
        });
    });
});
