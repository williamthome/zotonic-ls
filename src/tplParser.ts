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
    SnippetString,
    TextEditor,
    TextEditorEdit,
} from "vscode";
import {
    Tpl,
    ITplSnippet,
    TplCompletionItemProvider,
    ITplCompletionItemProvider,
    ITplSnippetCommandCallback
} from "./tpl";
import { ITplCommand } from "./tpl/commands";

type TplCommandName = keyof ITplCommand | "executeCommand";

type VSCodeCommandName<T extends TplCommandName> = `tpl.${T}`;

type TplCommandFunction<T extends TplCommandName> =
    T extends keyof ITplCommand
        ? ITplCommand[T] extends (...args: any[]) => any ? ITplCommand[T] : never
        : (...args: any[]) => any;

type TplCommandArgs<T extends TplCommandName> =
    T extends keyof ITplCommand
        ? ITplCommand[T] extends (...args: infer Args) => any ? Args : never
        : any[];

type TplCommandReturn<T extends TplCommandName> =
    T extends keyof ITplCommand
        ? ITplCommand[T] extends (...args: any[]) => infer Return ? Return : never
        : unknown;


type CommandKind = "command" | "textEditorCommand";

type CommandKindArgs<T extends CommandKind> =
    T extends "command"
        ? []
        : T extends "textEditorCommand"
            ? [TextEditor, TextEditorEdit]
            : never;

interface TplCommandInterpreter<T extends TplCommandName, K extends CommandKind = "command"> {
    tplCommandName: T,
    kind: K,
    callback: (...args: [...CommandKindArgs<K>, ...TplCommandArgs<T> extends any[] ? TplCommandArgs<T> : any[]]) => TplCommandReturn<T>
}

type RegisterTplCommand = {
    [T in TplCommandName]: TplCommandInterpreter<T, any>
};

type TextEditorCommandCallback<T extends any[] = any[]> = (textEditor: TextEditor, edit: TextEditorEdit, ...args: T) => void;

export class TplParser {
    public async setup(tpl: Tpl, context: ExtensionContext) {
        this
            .registerProviders(tpl, context)
            .registerCommands(context)
        ;
    }

    get tplCommands(): ITplCommand {
        return {
            getUserChoice: (choices, next) => {
                return this.executeCommand("getUserChoice", choices, next);
            },

            insertSnippet: (snippet) => {
                return this.executeCommand("insertSnippet", snippet);
            },

            showUpSnippets: () => {
                return this.executeCommand("showUpSnippets");
            },
        };
    };

    get vscodeCommands(): RegisterTplCommand {
        return {
            executeCommand: this.commandCallback,
            getUserChoice: this.commandGetUserChoice,
            insertSnippet: this.commandInsertSnippet,
            showUpSnippets: this.commandShowUpSnippets,
        };
    }

    genCommandName<T extends TplCommandName>(commandName: T): VSCodeCommandName<T> {
        return `tpl.${commandName}`;
    }

    executeCommand<T extends TplCommandName>(tplCommandName: T, ...args: TplCommandArgs<T>) {
        const vscodeCommandName = this.genCommandName(tplCommandName);
        return commands.executeCommand(vscodeCommandName, ...args) as TplCommandReturn<T>;
    }

    registerCommand<T extends TplCommandName>(context: ExtensionContext, tplCommandName: T, callback: TplCommandFunction<T>) {
        const vscodeCommandName = this.genCommandName(tplCommandName);
        const command = commands.registerCommand(vscodeCommandName, callback);
        context.subscriptions.push(command);
        return this;
    }

    registerTextEditorCommand<T extends TplCommandName>(context: ExtensionContext, tplCommandName: T, callback: TextEditorCommandCallback<TplCommandArgs<T>>) {
        const vscodeCommandName = this.genCommandName(tplCommandName);
        const command = commands.registerTextEditorCommand(
            vscodeCommandName,
            callback as TextEditorCommandCallback
        );
        context.subscriptions.push(command);
        return this;
    }

    get commandInsertSnippet(): TplCommandInterpreter<"insertSnippet", "textEditorCommand"> {
        return {
            tplCommandName: "insertSnippet",
            kind: "textEditorCommand",
            async callback(editor, _edit, snippet){
                editor.insertSnippet(new SnippetString(snippet));
            }
        };
    }

    get commandGetUserChoice(): TplCommandInterpreter<"getUserChoice"> {
        return {
            tplCommandName: "getUserChoice",
            kind: "command",
            async callback(choices, next) {
                const quickPick = window.createQuickPick();
                quickPick.items = choices.map((choice) => ({ label: choice }));
                quickPick.onDidChangeSelection(async ([{ label }]) => {
                    const choice = choices.find(choice => choice === label);
                    if (!choice) {
                        // TODO: Include valid choices in the error message
                        throw (new Error(`Unexpected no choice match in quick pick with label "${label}"`));
                    }
                    await next(choice);
                    quickPick.hide();
                });
                quickPick.show();
            },
        };
    }

    get commandShowUpSnippets(): TplCommandInterpreter<"showUpSnippets"> {
        return {
            tplCommandName: "showUpSnippets",
            kind: "command",
            callback: () => commands.executeCommand("editor.action.triggerSuggest")
        };
    }

    get commandCallback(): TplCommandInterpreter<"executeCommand"> {
        return {
            tplCommandName: "executeCommand",
            kind: "command",
            callback: (callback: ITplSnippetCommandCallback) => callback(this.tplCommands),
        };
    }

    public registerCommands(context: ExtensionContext) {
        for (const {kind, tplCommandName, callback} of Object.values(this.vscodeCommands)) {
            switch(kind) {
                case "command":
                    this.registerCommand(context, tplCommandName, callback);
                    continue;
                case "textEditorCommand":
                    this.registerTextEditorCommand(context, tplCommandName, callback as TextEditorCommandCallback);
                    continue;
                default:
                    throw new Error("Command kind not implemented.");
            }
        }
        return this;
    }

    public registerProvider(context: ExtensionContext) {
        return (provider: ITplCompletionItemProvider) => {
            if (provider instanceof TplCompletionItemProvider) {
                context.subscriptions.push(
                    // TODO: Move trigger characteres to provider
                    languages.registerCompletionItemProvider(
                        provider.selector,
                        this.parseCompletionItemProvider(provider),
                        ".", "[", "{", "|", "<"
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
                command: this.genCommandName("executeCommand"),
                title: snippet.command.hint || snippet.prefix,
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

                return snippets.map((s) => this.parseCompletionItem(s));
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
