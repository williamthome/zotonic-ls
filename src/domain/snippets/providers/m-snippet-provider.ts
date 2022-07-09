import { buildSnippetProvider, buildSnippet } from '@/domain/snippets';

export function buildMSnippetProvider() {
    return buildSnippetProvider({
        regex: /(?<={%|{{|%{|\[).*?\bm(\.)?\b/,
        getSnippets() {
            return Promise.resolve([
                buildSnippet({
                    label: 'm',
                    description: 'Provide data to templates.',
                }),
            ]);
        },
    });
}
