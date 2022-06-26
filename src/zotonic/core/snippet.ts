import { ICommand } from './command';
import { IFileFinder } from './file-finder';

// TODO: Add the snippet to the callback
export type ISnippetCommandCallback = (commands: ICommand) => Thenable<void>;

export interface ISnippetCommand {
    hint?: string;
    callback: ISnippetCommandCallback;
}

/**
 * Compatible with snippets JSON format.
 * @see https://code.visualstudio.com/docs/editor/userdefinedsnippets#_create-your-own-snippets
 */
export type ISnippet = {
    // TODO: Change 'prefix' property name. Maybe call it as label
    prefix: string;
    body?: string | [string, ...string[]];
    description?: string;
    documentation?: string;
    command?: ISnippetCommand;
    triggerCharacters?: string[];
    // TODO: Add 'kind' property: 'snippet' | 'property-key' | 'property-value'
    //       @see vscode.CompletionItemKind
};

export type Selector = 'tpl';

export type GetSnippets = (fileFinder: IFileFinder) => Thenable<ISnippet[]>;

export interface ISnippetProvider {
    selector: Selector;
    // TODO: Rename to regex
    pattern: RegExp;
    getSnippets: GetSnippets;
}
