import { Position } from './document';

export type CommandReturn<T = void> = Thenable<T>;

export interface ICommand {
    getUserChoice: (
        choices: string[],
        next: (choice: string) => CommandReturn,
    ) => CommandReturn;

    currentPosition: () => CommandReturn<Position>;

    insertSnippet: (snippet: string) => CommandReturn;

    showUpSnippets: () => CommandReturn;

    deleteText: (begin: Position, end: Position) => CommandReturn;

    growl: (msg: string) => CommandReturn;

    growlError: (msg: string) => CommandReturn;

    // TODO: Rename or move to a HTTP commands file
    get: <T>(url: string) => CommandReturn<T | Error>;
}
