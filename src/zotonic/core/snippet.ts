import { ICommand } from "./command";

export type ISnippetCommandCallback =
    (commands: ICommand) => Thenable<void>;

export interface ISnippetCommand {
    hint?: string,
    callback: ISnippetCommandCallback
}

/**
 * Compatible with snippets JSON format.
 * @see https://code.visualstudio.com/docs/editor/userdefinedsnippets#_create-your-own-snippets
 */
export type ISnippet = {
    prefix: string,
    body?: string | [string, ...string[]],
    description?: string,
    documentation?: string,
    command?: ISnippetCommand,
};

export type Selector = "tpl";

export interface ISnippetProvider {
    selector: Selector,
    pattern: RegExp,
    getSnippets(baseDir: string): Thenable<ISnippet[]>,
};
