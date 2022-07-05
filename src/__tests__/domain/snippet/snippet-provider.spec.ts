import { buildSnippetProvider } from '@/domain/snippet/snippet-provider';
import {
    expectAny,
    expectEqual,
    expectNotThrowException,
    expectThrowException,
} from '@/__tests__/__utils__';
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
                regex: expectAny(RegExp),
                triggerCharacters: expectAny(Array),
                getSnippets: expectAny(Function),
                flush: expectAny(Function),
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

            getSnippetsSpy.throwException = true;

            expectThrowException(sut.getSnippets());
        });
    });

    describe('flush', () => {
        it('should not throw', () => {
            const { sut } = makeSut();

            expectNotThrowException(sut.flush);
        });
    });
});
