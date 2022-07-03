import { TransformSnippet } from '@/domain/file';
import { GetSnippets } from '@/domain/snippet';
import { buildSpy } from '@/__tests__/__utils__';

export function getSnippetsSpy() {
    return buildSpy<GetSnippets>(() => {
        return Promise.resolve([]);
    });
}

export function transformSnippetSpy() {
    return buildSpy<TransformSnippet>(({ snippet }) => snippet);
}
