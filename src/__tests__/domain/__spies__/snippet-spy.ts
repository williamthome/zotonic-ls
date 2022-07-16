import { TransformSnippet } from '@/domain/files';
import { GetSnippets } from '@/domain/snippets';
import { buildSpy } from '@/__tests__/__utils__';
import { snippetMock } from '@/__tests__/domain/__mocks__/';

export function getSnippetsSpy() {
    return buildSpy<GetSnippets>(() => {
        return Promise.resolve([snippetMock()]);
    });
}

export function transformSnippetSpy() {
    return buildSpy<TransformSnippet>(({ snippet }) => snippet);
}
