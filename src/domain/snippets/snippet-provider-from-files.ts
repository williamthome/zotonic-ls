import {
    TransformSnippet,
    buildFilesByWorkspaces,
    FilenameRegexByWorkspace,
    FilesByGlobPattern,
} from '../../domain/files';
import { buildSnippet } from './snippet';
import { buildSnippetProvider } from './snippet-provider';

export function buildSnippetProviderFromFiles(args: {
    regex: RegExp;
    triggerCharacters?: string[];
    workspacesRoot: [string, ...string[]];
    workspaces: string[][];
    extensions: string[];
    transformSnippet?: TransformSnippet;
    filenameRegexByWorkspace: FilenameRegexByWorkspace;
    filesByGlobPattern: FilesByGlobPattern;
}) {
    const filesByWorkspaces = buildFilesByWorkspaces({
        workspacesRoot: args.workspacesRoot,
        workspaces: args.workspaces,
        extensions: args.extensions,
        filenameRegexByWorkspace: args.filenameRegexByWorkspace,
        filesByGlobPattern: args.filesByGlobPattern,
        allowDuplicates: false,
    });

    return buildSnippetProvider({
        regex: args.regex,
        triggerCharacters: args.triggerCharacters,
        async getSnippets() {
            const files = await filesByWorkspaces();

            return files.map((file) => {
                const snippet = buildSnippet({ label: file.name });

                return args.transformSnippet
                    ? args.transformSnippet({ snippet, file })
                    : snippet;
            });
        },
    });
}

export type SnippetProviderFromFiles = ReturnType<
    typeof buildSnippetProviderFromFiles
>;
