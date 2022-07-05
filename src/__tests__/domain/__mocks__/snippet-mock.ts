import { buildSnippet } from '@/domain/snippet';

export function snippetMock() {
    return buildSnippet({
        label: 'foo',
    });
}
