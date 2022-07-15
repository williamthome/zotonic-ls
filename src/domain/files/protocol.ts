import { Snippet } from '../../domain/snippets';
import { File } from './file';

export type FilenameRegexByWorkspace = (args: { workspace: string }) => RegExp;

export type TransformSnippet = (args: {
    snippet: Snippet;
    file: File;
}) => Snippet;

export type FilesByGlobPattern = (args: {
    cwd?: string;
    globPattern: string;
    ignoreGlobPattern?: string;
}) => Promise<File[]>;
