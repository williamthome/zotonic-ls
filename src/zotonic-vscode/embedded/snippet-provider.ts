import { Selector } from '../../zotonic/core';
import {
    EmbeddedGetSnippetsArgs,
    EmbeddedGetSnippetsReturn,
    IEmbeddedSnippetProvider,
} from '../core/snippets';

interface ConstructorArgs {
    selector?: Selector;
    // TODO: Rename to regex
    pattern: RegExp;
    triggerCharacters?: string[];
}

export abstract class EmbeddedSnippetProvider
    implements IEmbeddedSnippetProvider
{
    public abstract getSnippets(
        ...args: EmbeddedGetSnippetsArgs
    ): EmbeddedGetSnippetsReturn;

    // TODO: Rename to regex
    public pattern: RegExp;
    public selector: Selector;
    public triggerCharacters: string[];

    constructor({ pattern, selector, triggerCharacters }: ConstructorArgs) {
        this.pattern = pattern;
        this.selector = selector || 'tpl';
        this.triggerCharacters = triggerCharacters || ['.', '[', '{', '|', '<'];
    }
}
