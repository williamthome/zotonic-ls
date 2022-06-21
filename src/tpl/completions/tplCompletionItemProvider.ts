import { ITplSnippet } from "./tplSnippet";

type TplSelector = "tpl";

export interface ITplCompletionItemProvider {
    selector: TplSelector,
    pattern: RegExp,
    getSnippets(baseDir: string): Promise<ITplSnippet[]>,
};

interface ConstructorArgs {
    selector?: TplSelector,
    pattern: RegExp,
}

export abstract class TplCompletionItemProvider implements ITplCompletionItemProvider {
    public abstract loadSnippets(baseDir: string): Promise<ITplSnippet[]>;

    public pattern: RegExp;
    public selector: TplSelector;

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
