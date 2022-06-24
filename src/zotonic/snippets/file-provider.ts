import { FileNamePattern, IFileFinder, ISnippet } from '../core';
import { SnippetProvider } from './provider';

type TransformSnippet = (
    snippet: ISnippet,
    filePath: string,
    fileName: string,
) => ISnippet;

interface ConstructorArgs {
    workspacesRoot?: string | string[];
    workspaces: string[][];
    extensions: string[];
    pattern: RegExp;
    fileNamePattern: FileNamePattern;
    transformSnippet?: TransformSnippet;
}

export class FileSnippetProvider extends SnippetProvider {
    public workspacesRoot: string | string[];
    public workspaces: string[][];
    public extensions: string[];
    public fileNamePattern: FileNamePattern;
    public transformSnippet?: TransformSnippet;

    constructor({
        workspacesRoot,
        workspaces,
        extensions,
        pattern,
        fileNamePattern,
        transformSnippet,
    }: ConstructorArgs) {
        super({
            pattern,
        });

        this.workspacesRoot = workspacesRoot || ['apps', 'apps_user'];
        this.workspaces = workspaces;
        this.extensions = extensions;
        this.fileNamePattern = fileNamePattern;
        this.transformSnippet = transformSnippet;
    }

    public async loadSnippets(fileFinder: IFileFinder): Promise<ISnippet[]> {
        const files = await fileFinder.findInWorkspace({
            maybeWorkspacesRoot: this.workspacesRoot,
            workspaces: this.workspaces,
            extensions: this.extensions,
            fileNamePattern: this.fileNamePattern,
            allowDuplicates: false,
        });

        return files.map(({ fileName, filePath }) => {
            const baseSnippet: ISnippet = {
                prefix: fileName,
                body: fileName,
            };

            return this.transformSnippet
                ? this.transformSnippet(baseSnippet, filePath, fileName)
                : baseSnippet;
        });
    }
}
