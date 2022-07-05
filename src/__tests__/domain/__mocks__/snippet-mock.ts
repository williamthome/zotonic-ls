import { buildSnippet } from '@/domain/snippets';

export function snippetMock() {
    return buildSnippet({
        label: 'foo',
    });
}
