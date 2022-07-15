import { buildHttpRequestArgs, HttpRequestOptions } from '@/domain/http';
import { expectAny, expectEqual } from '@/__tests__/__utils__';

describe('domain/http', () => {
    describe('buildHttpRequestArgs', () => {
        function makeSut(options?: HttpRequestOptions) {
            const sut = buildHttpRequestArgs({
                url: 'foo.bar',
                options,
            });

            return { sut };
        }

        it('should return with full props', () => {
            const { sut } = makeSut();

            expectEqual(sut, {
                url: expectAny(String),
                options: expectAny(Object),
            });
        });

        it('should return with full props even if without optionals', () => {
            const { sut } = makeSut({ method: 'GET' });

            expectEqual(sut, {
                url: expectAny(String),
                options: expectAny(Object),
            });
        });
    });
});
