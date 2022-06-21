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

type TplCommandName = keyof ITplCommand | "executeCommand" | "showUpSnippets";

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
export class TplParser {
    public async setup(tpl: Tpl, context: ExtensionContext) {
        this
            .registerProviders(tpl, context)
            .registerCommands(context)
        ;
    }

    get commands(): ITplCommand {
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

    registerTextEditorCommand<T extends TplCommandName>(context: ExtensionContext, tplCommandName: T, callback: (editor: TextEditor, edit: TextEditorEdit,...args: TplCommandArgs<T>) => void) {
        const vscodeCommandName = this.genCommandName(tplCommandName);
        const command = commands.registerTextEditorCommand(
            vscodeCommandName,
            callback as (textEditor: TextEditor, edit: TextEditorEdit, ...args: any[]) => void
        );
        context.subscriptions.push(command);
        return this;
    }

    registerInsertSnippet(context: ExtensionContext) {
        return this.registerTextEditorCommand(
            context,
            "insertSnippet",
            (editor, _edit, snippet) =>
                editor.insertSnippet(new SnippetString(snippet))
        );
    }

    registerPickUserChoice(context: ExtensionContext) {
        return this.registerCommand(
            context,
            "getUserChoice",
            async (choices: string[], next: (choice: string) => Thenable<void>) => {
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

    registerShowUpSnippets(context: ExtensionContext) {
        return this.registerCommand(
            context,
            "showUpSnippets",
            () => commands.executeCommand("editor.action.triggerSuggest")
        );
    }

    public registerCallbackCommand(context: ExtensionContext) {
        return this.registerCommand(
            context,
            "executeCommand",
            (callback: ITplSnippetCommandCallback) => callback(this.commands)
        );
    }

    public registerCommands(context: ExtensionContext) {
        return this
            .registerPickUserChoice(context)
            .registerInsertSnippet(context)
            .registerCallbackCommand(context)
            .registerShowUpSnippets(context)
        ;
    }

    public registerProvider(context: ExtensionContext) {
        return (provider: ITplCompletionItemProvider) => {
            if (provider instanceof TplCompletionItemProvider) {
                context.subscriptions.push(
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
