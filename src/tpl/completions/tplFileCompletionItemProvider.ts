import { findFilesByPattern } from "../utils/path";
import { TplCompletionItemProvider } from "./tplCompletionItemProvider";
import { ITplSnippet } from "./tplSnippet";

type FilenameRegExp = (rootsEscaped: string) => RegExp;
type TransformSnippet = (snippet: ITplSnippet, filePath: string) => ITplSnippet;

interface ConstructorArgs {
    workspaces?: string[],
    roots: string[][],
    extensions: string[],
    pattern: RegExp,
    filenameRegExp: FilenameRegExp;
    transformSnippet?: TransformSnippet
}

export class TplFileCompletionItemProvider extends TplCompletionItemProvider {
    public workspaces: string[];
    public roots: string[][];
    public extensions: string[];
    public filenameRegExp: FilenameRegExp;
    public transformSnippet?: TransformSnippet;

    constructor({
        workspaces,
        roots,
        extensions,
        pattern,
        filenameRegExp,
        transformSnippet
    }: ConstructorArgs) {
        super({ pattern });

        this.workspaces = workspaces || ["apps", "apps_user"];
        this.roots = roots;
        this.extensions = extensions;
        this.filenameRegExp = filenameRegExp;
        this.transformSnippet = transformSnippet;
    }

    public async loadSnippets(baseDir: string): Promise<ITplSnippet[]> {
        const workspaces = this.workspaces.join(",");
        const roots = this.roots.map(r => r.join("/")).join(",");
        const extensions = this.extensions.join(",");
        const pattern = `{${workspaces}}/**/{${roots}}/**/*.{${extensions}}`;
        const files = await findFilesByPattern(baseDir, pattern);
        const snippets = files.reduce((arr, file) => {
            const rootsEscaped = this.roots.map(r => r.join("\\/")).join("|");
            const filePathMatch = this.filenameRegExp(rootsEscaped).exec(file);
            if (!filePathMatch || !filePathMatch.length) {
                return arr;
            }
            const filePath = filePathMatch[0];
            if (!arr.some((s) => s.prefix === filePath)) {
                const baseSnippet: ITplSnippet = { prefix: filePath, body: filePath };
                const snippet = this.transformSnippet
                    ? this.transformSnippet(baseSnippet, filePath)
                    : baseSnippet;

                arr.push(snippet);
            }
            return arr;
        }, new Array<ITplSnippet>());
        return snippets;
    };
}
