import { ITplSnippet } from "./tplSnippet";

export type ITplCompletionItemProvider = {
    selector: string,
    pattern: RegExp,
    getSnippets(baseDir: string): Promise<ITplSnippet[]>
};

interface ConstructorArgs {
    pattern: RegExp,
    selector?: string
}

export abstract class TplCompletionItemProvider implements ITplCompletionItemProvider {
    public abstract loadSnippets(baseDir: string): Promise<ITplSnippet[]>;

    public pattern: RegExp;
    public selector: string;

    private _snippets: ITplSnippet[] | undefined;

    constructor({ pattern, selector }: ConstructorArgs) {
        this.pattern = pattern;
        this.selector = selector || "tpl";
    }

    // Internal functions

    public async getSnippets(baseDir: string) {
        if (!this._snippets) {
            this._snippets = await this.loadSnippets(baseDir);
        }
        return this._snippets;
    }
}
