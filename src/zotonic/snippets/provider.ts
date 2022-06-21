import { ISnippet, ISnippetProvider, Selector } from "../core";

interface ConstructorArgs {
    selector?: Selector,
    pattern: RegExp,
}

export abstract class SnippetProvider implements ISnippetProvider {
    public abstract loadSnippets(baseDir: string): Promise<ISnippet[]>;

    public pattern: RegExp;
    public selector: Selector;

    private _snippets: ISnippet[] | undefined;

    constructor({ pattern, selector }: ConstructorArgs) {
        this.pattern = pattern;
        this.selector = selector || "tpl";
    }

    public async getSnippets(baseDir: string) {
        if (!this._snippets) {
            this._snippets = await this.loadSnippets(baseDir);
        }
        return this._snippets;
    }
}
