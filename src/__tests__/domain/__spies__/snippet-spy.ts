import { GetSnippets } from '@/domain/snippet';
import { buildSpy } from '@/__tests__/__utils__';

export function getSnippetsSpy() {
    return buildSpy<GetSnippets>(() => {
        return Promise.resolve([]);
    });
}
