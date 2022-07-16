import { FilesByGlobPattern } from '../files';
import {
    buildImageTagSnippetProvider,
    buildModelSnippetProvider,
    buildMSnippetProvider,
    buildTemplateTagSnippetProvider,
} from './providers';
import { SnippetProvider } from './snippet-provider';

export function buildSnippetProviders(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
}) {
    const snippetProviders: SnippetProvider[] = [buildMSnippetProvider()];

    const snippetProvidersFromFiles = [
        buildModelSnippetProvider,
        buildImageTagSnippetProvider,
        buildTemplateTagSnippetProvider,
    ];
    snippetProvidersFromFiles.forEach((snippetProvider) => {
        snippetProviders.push(
            snippetProvider({
                filesByGlobPattern: args.filesByGlobPattern,
                workspacesRoot: args.workspacesRoot,
            }),
        );
    });

    return snippetProviders;
}
