import { FilesByWorkspace } from '@/domain/file';
import { buildImageTagSnippetProvider } from '@/domain/snippets';

export function buildZ() {
    const filesByWorkspace: FilesByWorkspace = () => {
        return Promise.resolve([]);
    };

    const _snippetProviders = [
        buildImageTagSnippetProvider({
            filesByWorkspace,
        }),
    ];

    return {
        get selector() {
            return 'tpl';
        },
        get snippetProviders() {
            return _snippetProviders;
        },
    };
}

export type Z = ReturnType<typeof buildZ>;
