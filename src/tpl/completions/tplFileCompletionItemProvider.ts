import { findFilesByPattern } from "../utils/path";
import { TplCompletionItemProvider } from "./tplCompletionItemProvider";
import { ITplSnippet } from "./tplSnippet";

interface ConstructorArgs {
    workspaces?: string[],
    roots: string[][],
    extensions: string[],
    pattern: RegExp
}

export class TplFileCompletionItemProvider extends TplCompletionItemProvider {
    public workspaces: string[];
    public roots: string[][];
    public extensions: string[];

    constructor({ workspaces, roots, extensions, pattern }: ConstructorArgs) {
        super({ pattern });

        this.workspaces = workspaces || ["apps", "apps_user"];
        this.extensions = extensions;
        this.roots = roots;
    }

    public async loadSnippets(baseDir: string): Promise<ITplSnippet[]> {
        const workspaces = this.workspaces.join(",");
        const roots = this.roots.map(r => r.join("/")).join(",");
        const extensions = this.extensions.join(",");
        const pattern = `{${workspaces}}/**/{${roots}}/**/*.{${extensions}}`;
        const files = await findFilesByPattern(baseDir, pattern);
        const snippets = files.reduce((arr, file) => {
            const rootsEscaped = this.roots.map(r => r.join("\\/")).join("|");
            const filePathRe = new RegExp(`(?<=\\/(${rootsEscaped})\\/).*`);
            const filePathMatch = filePathRe.exec(file);
            if (!filePathMatch || !filePathMatch.length) {
                return arr;
            }
            const filePath = filePathMatch[0];
            if (!arr.some((s) => s.prefix === filePath)) {
                const snippet: ITplSnippet = {
                    prefix: filePath,
                    body: filePath,
                    // TODO: Transform snippet
                    // description: "A .tpl file located at '<apps|apps_user>/<module>/priv/images'.",
                    // documentation: `
                    //     <h1>Templates</h1>
                    //     <p>Templates are text files marked up using the Zotonic template language. Zotonic interprets that mark-up to dynamically generate HTML pages. Zotonic’s template syntax is very similar to the Django Template Language (DTL).</p>
                    //     <br>
                    //     <a href="https://zotonic.com/en/latest/developer-guide/templates.html">@docs/developer-guide</a>
                    //     <br>
                    //     <a href="https://zotonic.com/search?qs=templates">@docs/search</a>
                    // `
                };

                arr.push(snippet);
            }
            return arr;
        }, new Array<ITplSnippet>());
        return snippets;
    };
}
