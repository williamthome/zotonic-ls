import { FilesByGlobPattern } from '@/domain/files';
import {
    buildImageTagSnippetProvider,
    buildModelSnippetProvider,
    buildMSnippetProvider,
    buildTemplateTagSnippetProvider,
    SnippetProvider,
} from '@/domain/snippets';

export function buildZ(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
}) {
    const _snippetProviders: SnippetProvider[] = [buildMSnippetProvider()];

    const _snippetProvidersFromFiles = [
        buildModelSnippetProvider,
        buildImageTagSnippetProvider,
        buildTemplateTagSnippetProvider,
    ];

    _snippetProvidersFromFiles.forEach((snippetProvider) => {
        _snippetProviders.push(
            snippetProvider({
                filesByGlobPattern: args.filesByGlobPattern,
                workspacesRoot: args.workspacesRoot,
            }),
        );
    });

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
