import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    ExtensionContext,
    MarkdownString,
    Position,
    TextDocument,
    languages,
    window,
    workspace,
    commands,
    Disposable,
    SnippetString,
} from "vscode";
import {
    Tpl,
    ITplSnippet,
    TplProvider,
    TplCompletionItemProvider,
    ITplCompletionItemProvider,
    ITplSnippetCommandCallback
} from "./tpl";
import { ITplCommand } from "./tpl/commands";
// import { TplCommandName } from "./tpl/commands";

// const commandNames = [
//     "tpl.snippet.pick",
//     "tpl.snippet.insert"
// ] as const;

// type CommandName = typeof commandNames[number];

// type Command = { [Property in TplCommandName]: CommandName };

class TplCommandParser {
    // registerCommand(context: ExtensionContext, name: CommandName, callback: (...args: any[]) => any) {
    //     const command = commands.registerCommand(name, callback);
    //     context.subscriptions.push(command);
    //     return this;
    // }

    // registerCommands(context: ExtensionContext) {
    //     this.registerSnippetPick(context);
    // }

    // registerSnippetPick(context: ExtensionContext) {
    //     this.registerCommand(context, "tpl.snippet.pick", (snippets: string[]) => {
    //         const quickPick = window.createQuickPick();
    //         quickPick.items = snippets.map((snippet) => ({ label: snippet }));
    //         quickPick.onDidChangeSelection(async ([{ label }]) => {
    //             const snippet = snippets.find(snippet => snippet === label);
    //             if (!snippet) {
    //                 throw (new Error(`Unexpected no snippet match in quick pick with label "${label}"`));
    //             }

    //             // await commands.executeCommand("tpl.snippet.insert", snippet);
    //             console.log("snippet", snippet);
    //             quickPick.hide();
    //         });
    //         quickPick.show();
    //     });
    // }
}

export class TplParser {
    // get commands(): Command {
    //     return {
    //         snippetPick: "tpl.snippet.pick"
    //     };
    // }

    // public registerCommands() {
    //     commandNames.forEach(v => {
    //         if (v === "tpl.snippet.pick") {

    //         }
    //     });
    // }

    public async setup(tpl: Tpl, context: ExtensionContext) {
        this
            .registerProviders(tpl, context)
            .registerCommands(context)
        ;
    }

    get commands(): ITplCommand {
        return {
            getUserChoice(choices, next) {
                return commands.executeCommand("tpl.choice", choices, next) as any;
            },
            insertSnippet(snippet) {
                return commands.executeCommand("tpl.snippet.insert", snippet) as any;
            },
        };
    };

    registerCommand(context: ExtensionContext, name: string, callback: (...args: any[]) => any) {
        const command = commands.registerCommand(name, callback);
        context.subscriptions.push(command);
        return this;
    }

    registerInsertSnippet(context: ExtensionContext) {
        const command = commands.registerTextEditorCommand(
            "tpl.snippet.insert",
            (editor, _edit, snippet) => {
                console.log("snippet", snippet);
		        return editor.insertSnippet(new SnippetString(snippet));
	    });
        context.subscriptions.push(command);
        return this;
    }

    registerPickUserChoice(context: ExtensionContext) {
        return this.registerCommand(
            context,
            "tpl.choice",
            (choices: string[], next: (choice: string) => Promise<void>) => {
                const quickPick = window.createQuickPick();
                quickPick.items = choices.map((choice) => ({ label: choice }));
                quickPick.onDidChangeSelection(async ([{ label }]) => {
                    const choice = choices.find(choice => choice === label);
                    if (!choice) {
                        throw (new Error(`Unexpected no choice match in quick pick with label "${label}"`));
                    }
                    await next(choice);
                    quickPick.hide();
                });
                quickPick.show();
            }
        );
    }

    public registerCallbackCommand(context: ExtensionContext) {
        return this.registerCommand(
            context,
            "tpl.command",
            (callback: ITplSnippetCommandCallback) => callback(this.commands)
        );
    }

    public registerCommands(context: ExtensionContext) {
        return this
            .registerPickUserChoice(context)
            .registerInsertSnippet(context)
            .registerCallbackCommand(context)
        ;
    }

    public registerProvider(context: ExtensionContext) {
        return (provider: TplProvider) => {
            if (provider instanceof TplCompletionItemProvider) {
                context.subscriptions.push(
                    languages.registerCompletionItemProvider(
                        provider.selector,
                        this.parseCompletionItemProvider(provider)
                    )
                );
            }
        };
    }

    public registerProviders(tpl: Tpl, context: ExtensionContext) {
        tpl.providers.forEach(this.registerProvider(context));
        return this;
    }

    public parseCompletionItem(snippet: ITplSnippet): CompletionItem {
        const completionItem = new CompletionItem(
            snippet.prefix, CompletionItemKind.Snippet
        );
        completionItem.insertText = Array.isArray(snippet.body)
            ? snippet.body.join("\n")
            : snippet.body;
        completionItem.detail = snippet.description;

        if (snippet.documentation) {
            const documentation = new MarkdownString(snippet.documentation.trim());
            documentation.supportHtml = true;
            documentation.isTrusted = true;
            completionItem.documentation = documentation;
        }

        if (snippet.command) {
            completionItem.command = {
                command: "tpl.command",
                title: snippet.command.name,
                arguments: [snippet.command.callback]
            };
        }

        return completionItem;
    }

    public parseCompletionItemProvider(
        provider: ITplCompletionItemProvider
    ): CompletionItemProvider {
        const provideCompletionItems = async (
            document: TextDocument,
            position: Position,
            _token: CancellationToken,
            _context: CompletionContext
        ): Promise<CompletionItem[] | undefined> => {
            if (document.getWordRangeAtPosition(position, provider.pattern)) {
                // TODO: Snippets cache
                const baseDir = this.getDocumentWorkspaceFolder() || __dirname;
                const snippets = await provider.getSnippets(baseDir);
                return snippets.map(this.parseCompletionItem);
            };
        };
        return { provideCompletionItems };
    }

    private getDocumentWorkspaceFolder(): string | undefined {
        if (!window.activeTextEditor || !workspace.workspaceFolders) {
            return undefined;
        }

        const fileName = window.activeTextEditor.document.fileName;
        return workspace.workspaceFolders
            .map((folder) => folder.uri.fsPath)
            .filter((fsPath) => fileName.startsWith(fsPath))[0];
    }
}
