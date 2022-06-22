import { ISnippet, ISnippetProvider, Selector } from '../core';

interface ConstructorArgs {
    selector?: Selector;
    pattern: RegExp;
    triggerCharacters?: string[];
}

export abstract class SnippetProvider implements ISnippetProvider {
    public abstract loadSnippets(baseDir: string): Promise<ISnippet[]>;

    public pattern: RegExp;
    public selector: Selector;
    public triggerCharacters: string[];

    private _snippets: ISnippet[] | undefined;

    constructor({ pattern, selector, triggerCharacters }: ConstructorArgs) {
        this.pattern = pattern;
        this.selector = selector || 'tpl';
        this.triggerCharacters = triggerCharacters || ['.', '[', '{', '|', '<'];
    }

    public async getSnippets(baseDir: string) {
        if (!this._snippets) {
            this._snippets = await this.loadSnippets(baseDir);
        }
        return this._snippets;
    }
}
