import { TransformSnippet } from '@/domain/file';
import { GetSnippets } from '@/domain/snippet';
import { buildSpy } from '@/__tests__/__utils__';
import { snippetMock } from '../__mocks__';

export function getSnippetsSpy() {
    return buildSpy<GetSnippets>(() => {
        return Promise.resolve([snippetMock()]);
    });
}

export function transformSnippetSpy() {
    return buildSpy<TransformSnippet>(({ snippet }) => snippet);
}
