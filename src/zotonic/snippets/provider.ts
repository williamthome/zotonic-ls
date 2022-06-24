import { IFileFinder, ISnippet, ISnippetProvider, Selector } from '../core';

interface ConstructorArgs {
    selector?: Selector;
    pattern: RegExp;
    triggerCharacters?: string[];
}

export abstract class SnippetProvider implements ISnippetProvider {
    public abstract loadSnippets(fileFinder: IFileFinder): Promise<ISnippet[]>;

    public pattern: RegExp;
    public selector: Selector;
    public triggerCharacters: string[];

    private _snippets: ISnippet[] | undefined;

    constructor({ pattern, selector, triggerCharacters }: ConstructorArgs) {
        this.pattern = pattern;
        this.selector = selector || 'tpl';
        this.triggerCharacters = triggerCharacters || ['.', '[', '{', '|', '<'];
    }

    public async getSnippets(fileFinder: IFileFinder) {
        if (!this._snippets) {
            this._snippets = await this.loadSnippets(fileFinder);
        }
        return this._snippets;
    }
}
