import { ISnippet } from '../core';
import { SnippetProvider } from './provider';
import { findFilesByPattern } from '../utils/path';

type FilenameRegExp = (escapedWorkspaces: string) => RegExp;
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
    filenameRegExp: FilenameRegExp;
    transformSnippet?: TransformSnippet;
}

export class FileSnippetProvider extends SnippetProvider {
    public workspacesRoot: string | string[];
    public workspaces: string[][];
    public extensions: string[];
    public filenameRegExp: FilenameRegExp;
    public transformSnippet?: TransformSnippet;

    constructor({
        workspacesRoot,
        workspaces,
        extensions,
        pattern,
        filenameRegExp,
        transformSnippet,
    }: ConstructorArgs) {
        super({
            pattern,
        });

        this.workspacesRoot = workspacesRoot || ['apps', 'apps_user'];
        this.workspaces = workspaces;
        this.extensions = extensions;
        this.filenameRegExp = filenameRegExp;
        this.transformSnippet = transformSnippet;
    }

    public async loadSnippets(baseDir: string): Promise<ISnippet[]> {
        const root = this.maybeEmbrace(this.workspacesRoot);
        const path = this.maybeEmbrace(this.workspaces.map((r) => r.join('/')));
        const ext = this.maybeEmbrace(this.extensions);
        const pattern = `${root}/**/${path}/**/*.${ext}`;

        const files = await findFilesByPattern(baseDir, pattern);
        const snippets = files.reduce((arr, filePath) => {
            const escapedWorkspaces = this.workspaces
                .map((r) => r.join('\\/'))
                .join('|');

            const filePathMatch =
                this.filenameRegExp(escapedWorkspaces).exec(filePath);

            if (!filePathMatch || !filePathMatch.length) {
                return arr;
            }

            const fileName = filePathMatch[0];
            if (!arr.some((s) => s.prefix === fileName)) {
                const baseSnippet: ISnippet = {
                    prefix: fileName,
                    body: fileName,
                };

                const snippet = this.transformSnippet
                    ? this.transformSnippet(baseSnippet, filePath, fileName)
                    : baseSnippet;

                arr.push(snippet);
            }
            return arr;
        }, new Array<ISnippet>());
        return snippets;
    }

    private maybeEmbrace<T, K>(arr: T, value?: K) {
        return Array.isArray(arr)
            ? arr.length > 1
                ? `{${value || arr.join(',')}}`
                : value || arr[0]
            : value;
    }
}
