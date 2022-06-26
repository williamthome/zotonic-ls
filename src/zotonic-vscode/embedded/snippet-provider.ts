import { Selector } from '../../zotonic/core';
import {
    EmbeddedGetSnippetsArgs,
    EmbeddedGetSnippetsReturn,
    IEmbeddedSnippetProvider,
} from '../core/snippets';

interface ConstructorArgs {
    selector?: Selector;
    pattern: RegExp;
    triggerCharacters?: string[];
}

export abstract class EmbeddedSnippetProvider
    implements IEmbeddedSnippetProvider
{
    public abstract getSnippets(
        ...args: EmbeddedGetSnippetsArgs
    ): EmbeddedGetSnippetsReturn;

    public pattern: RegExp;
    public selector: Selector;
    public triggerCharacters: string[];

    constructor({ pattern, selector, triggerCharacters }: ConstructorArgs) {
        this.pattern = pattern;
        this.selector = selector || 'tpl';
        this.triggerCharacters = triggerCharacters || ['.', '[', '{', '|', '<'];
    }
}
