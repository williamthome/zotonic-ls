export interface ICommand {
    getUserChoice: (
        choices: string[],
        next: (choice: string) => Thenable<void>,
    ) => Thenable<void>;

    insertSnippet: (snippet: string) => Thenable<void>;

    showUpSnippets: () => Thenable<void>;
}
