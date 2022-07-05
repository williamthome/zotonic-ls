import { Snippet } from './snippets';

// Types

export type File = ReturnType<typeof buildFile>;

export type FilenameRegexByWorkspace = (workspace: string) => RegExp;

export type TransformSnippet = (args: {
    snippet: Snippet;
    file: File;
}) => Snippet;

export type FilesByWorkspace = (args: {
    cwd?: string;
    workspacesRoot?: string | string[];
    workspaces: string[][];
    extensions: string[];
    allowDuplicates?: boolean;
}) => Promise<File[]>;

export type FilesByGlobPattern = (args: {
    cwd?: string;
    globPattern: string;
    ignoreGlobPattern?: string;
}) => Promise<File[]>;

// API

export function buildFile(args: { name: string; path: string }) {
    return {
        name: args.name,
        path: args.path,
    };
}
