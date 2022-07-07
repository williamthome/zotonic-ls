import { FilesByGlobPattern } from '../domain/files';
import { buildImageTagSnippetProvider } from '../domain/snippets';

export function buildZ(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
}) {
    const _snippetProviders = [
        buildImageTagSnippetProvider({
            filesByGlobPattern: args.filesByGlobPattern,
            workspacesRoot: args.workspacesRoot,
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
