import {
    buildSnippetToken,
    snippetParam,
} from '@/domain/snippets/helpers/snippet-helper';
import { expectAny, expectEqual, expectZObj } from '@/__tests__/__utils__';

describe('domain/snippets/helpers/snippet-helper', () => {
    describe('buildSnippetToken', () => {
        function makeSut() {
            const sut = buildSnippetToken({
                token: 'foo',
            });

            return {
                sut,
            };
        }

        it('should build with full props', () => {
            const { sut } = makeSut();

            expectZObj(sut, {
                token: expectAny(String),
                editable: false,
                prefix: expectAny(String),
                suffix: expectAny(String),
            });
        });
    });

    describe('snippetParam', () => {
        function makeSut() {
            const sut = snippetParam({
                index: 1,
            });

            return {
                sut,
            };
        }

        it('should build with full props', () => {
            const { sut } = makeSut();

            expectEqual(sut, expectAny(String));
        });
    });
});
