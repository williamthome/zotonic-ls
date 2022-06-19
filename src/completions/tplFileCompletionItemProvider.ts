import * as vscode from "vscode";
import { TplCompletionItemProvider, ITplSnippet } from "./tplCompletionItemProvider";

interface ConstructorArgs {
    extension: string,
    root: string[],
    pattern: RegExp
}

export class TplFileCompletionItemProvider extends TplCompletionItemProvider {
    public extension: string;
    public root: string[];

    constructor({ extension, root, pattern }: ConstructorArgs) {
        super({ pattern });

        this.extension = extension;
        this.root = root;
    }

    public loadSnippets(): Promise<ITplSnippet[]> {
        return new Promise(async (resolve) => {
            const rootPath = this.root.join("/");
            const pattern = `{apps,apps_user}/**/${rootPath}/**/*.${this.extension}`;
            const templates = await vscode.workspace.findFiles(pattern);
            const snippets = templates.reduce((arr, file) => {
                const rootPathEscaped = this.root.join("\\/");
                const filePathRe = new RegExp(`(?<=\\/${rootPathEscaped}\\/).*`);
                const filePathMatch = filePathRe.exec(file.fsPath);
                if (!filePathMatch || !filePathMatch.length) {
                    return arr;
                }
                const filePath = filePathMatch[0];
                if (!arr.some((s) => s.prefix === filePath)) {
                    const snippet: ITplSnippet = {
                        prefix: filePath,
                        body: filePath,
                        description: "A .tpl file located at '<apps|apps_user>/<module>/priv/templates'.",
                        documentation: `
                            <h1>Templates</h1>
                            <p>Templates are text files marked up using the Zotonic template language. Zotonic interprets that mark-up to dynamically generate HTML pages. Zotonic’s template syntax is very similar to the Django Template Language (DTL).</p>
                            <br>
                            <a href="https://zotonic.com/en/latest/developer-guide/templates.html">@docs/developer-guide</a>
                            <br>
                            <a href="https://zotonic.com/search?qs=templates">@docs/search</a>
                        `
                    };

                    arr.push(snippet);
                }
                return arr;
            }, new Array<ITplSnippet>());
            resolve(snippets);
        });
    };
}
