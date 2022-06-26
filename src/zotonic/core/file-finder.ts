// TODO: Rename to FileNameRegex
export type FileNamePattern = (escapedWorkspaces: string) => RegExp;

export interface FindInWorkspaceArgs {
    maybeBaseDir?: string;
    maybeWorkspacesRoot?: string | string[];
    workspaces: string[][];
    extensions: string[];
    fileNamePattern: FileNamePattern;
    allowDuplicates?: boolean;
}

export interface FindInWorkspaceReturn {
    fileName: string;
    filePath: string;
}

export type FindInWorkspace = (
    args: FindInWorkspaceArgs,
) => Promise<FindInWorkspaceReturn[]>;

export interface FindByPatternArgs {
    cwd?: string;
    // TODO: Rename to globPattern
    pattern: string;
    // TODO: Rename to globIgnorePattern
    ignorePattern?: string;
}

export type FindByPattern = (args: FindByPatternArgs) => Promise<string[]>;

export interface IFileFinder {
    findInWorkspace: FindInWorkspace;
    findByPattern: FindByPattern;
    maybeEmbrace: <T, K>(arr: T, value?: K) => string;
}
