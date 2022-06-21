import { ITplCommand } from "../commands";

export type ITplSnippetCommandCallback = (commands: ITplCommand) => Thenable<void>;

export interface ITplSnippetCommand {
    hint?: string,
    callback: ITplSnippetCommandCallback
}

/**
 * Compatible with snippets JSON format.
 * @see https://code.visualstudio.com/docs/editor/userdefinedsnippets#_create-your-own-snippets
 */
export type ITplSnippet = {
    prefix: string,
    body?: string | [string, ...string[]],
    description?: string,
    documentation?: string,
    command?: ITplSnippetCommand,
    // callback: (...args: any[]) =>
};
