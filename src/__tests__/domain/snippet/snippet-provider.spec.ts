import { buildSnippetProvider } from '@/domain/snippet/snippet-provider';
import { expectEqual, expectRaiseException } from '@/__tests__/__utils__';
import { getSnippetsSpy } from '../__spies__/snippet-spy';

describe('domain/snippet/snippet-provider', () => {
    function makeSut() {
        const getSnippets = getSnippetsSpy();

        const sut = buildSnippetProvider({
            regex: /foo/,
            getSnippets: getSnippets.spy,
            triggerCharacters: new Array<string>(),
        });

        return {
            sut,
            getSnippetsSpy: getSnippets,
        };
    }

    describe('buildSnippetProvider', () => {
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

    describe('getSnippets', () => {
        it('should be called once', () => {
            const { sut, getSnippetsSpy } = makeSut();

            sut.getSnippets();

            expectEqual(getSnippetsSpy.calledOnce, true);
        });

        it('should be called with right args', () => {
            const { sut, getSnippetsSpy } = makeSut();

            sut.getSnippets();

            expectEqual(getSnippetsSpy.args, undefined);
        });

        it('should throw if throws', () => {
            const { sut, getSnippetsSpy } = makeSut();

            getSnippetsSpy.raiseException = true;

            expectRaiseException(sut.getSnippets());
        });
    });
});
