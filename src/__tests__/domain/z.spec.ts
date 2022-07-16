import { buildZ } from '@/domain/z';
import { expectAny, expectZObj } from '@/__tests__/__utils__';
import { filesByGlobPatternSpy, httpRequestSpy } from './__spies__';

describe('domain/z-obj', () => {
    function makeSut() {
        const filesByGlobPattern = filesByGlobPatternSpy();
        const httpRequest = httpRequestSpy();

        const sut = buildZ({
            filesByGlobPattern: filesByGlobPattern.spy,
            host: 'foo',
            workspacesRoot: ['root'],
            httpRequest: httpRequest.spy,
        });

        return { sut };
    }

    describe('buildZ', () => {
        it('should return with full props', () => {
            const { sut } = makeSut();

            expectZObj(sut, {
                selector: expectAny(String),
                snippetProviders: expectAny(Array),
                hoverProviders: expectAny(Array),
                definitionProviders: expectAny(Array),
            });
        });
    });
});
