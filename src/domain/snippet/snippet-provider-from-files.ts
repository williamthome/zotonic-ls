import {
    FilenameRegexByWorkspace,
    TransformSnippet,
    FilesByWorkspace,
} from '../file';
import { buildSnippet } from './snippet';
import { buildSnippetProvider } from './snippet-provider';

export function buildSnippetProviderFromFiles(args: {
    regex: RegExp;
    triggerCharacters?: string[];
    workspacesRoot?: string | string[];
    workspaces: string[][];
    extensions: string[];
    filenameRegexByWorkspace: FilenameRegexByWorkspace;
    transformSnippet?: TransformSnippet;
    filesByWorkspace: FilesByWorkspace;
}) {
    return buildSnippetProvider({
        regex: args.regex,
        triggerCharacters: args.triggerCharacters,
        async getSnippets() {
            const files = await args.filesByWorkspace({
                workspacesRoot: args.workspacesRoot || ['apps', 'apps_user'],
                workspaces: args.workspaces,
                extensions: args.extensions,
                allowDuplicates: false,
            });

            return files.map((file) => {
                const baseSnippet = buildSnippet({ label: file.name });

                return args.transformSnippet
                    ? args.transformSnippet(baseSnippet, file)
                    : baseSnippet;
            });
        },
    });
}

export type SnippetProviderFromFiles = ReturnType<
    typeof buildSnippetProviderFromFiles
>;
