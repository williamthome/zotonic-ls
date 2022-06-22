import { ISnippet } from '../core';
import { SnippetProvider } from './provider';
import { findFilesByPattern } from '../utils/path';

type FilenameRegExp = (escapedWorkspaces: string) => RegExp;
type TransformSnippet = (snippet: ISnippet, filePath: string) => ISnippet;

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
        const workspacesRoot = Array.isArray(this.workspacesRoot)
            ? this.workspacesRoot.join(',')
            : this.workspacesRoot;
        const workspaces = this.workspaces.map((r) => r.join('/')).join(',');
        const extensions = this.extensions.join(',');
        const pattern = `{${workspacesRoot}}/**/{${workspaces}}/**/*.{${extensions}}`;
        const files = await findFilesByPattern(baseDir, pattern);
        const snippets = files.reduce((arr, file) => {
            const escapedWorkspaces = this.workspaces
                .map((r) => r.join('\\/'))
                .join('|');
            const filePathMatch =
                this.filenameRegExp(escapedWorkspaces).exec(file);
            if (!filePathMatch || !filePathMatch.length) {
                return arr;
            }
            const filePath = filePathMatch[0];
            if (!arr.some((s) => s.prefix === filePath)) {
                const baseSnippet: ISnippet = {
                    prefix: filePath,
                    body: filePath,
                };
                const snippet = this.transformSnippet
                    ? this.transformSnippet(baseSnippet, filePath)
                    : baseSnippet;

                arr.push(snippet);
            }
            return arr;
        }, new Array<ISnippet>());
        return snippets;
    }
}
