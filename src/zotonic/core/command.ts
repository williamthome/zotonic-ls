export interface ICommand {
    getUserChoice: (
        choices: string[],
        next: (choice: string) => Thenable<void>,
    ) => Thenable<void>;

    insertSnippet: (snippet: string) => Thenable<void>;

    showUpSnippets: () => Thenable<void>;

    growl: (msg: string) => Thenable<void>;

    growlError: (msg: string) => Thenable<void>;

    // TODO: Rename or move to a HTTP commands file
    get: <T>(url: string) => Thenable<T | Error>;
}
