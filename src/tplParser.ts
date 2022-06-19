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
} from "vscode";
import {
    Tpl,
    ITplSnippet,
    TplProvider,
    TplCompletionItemProvider,
    ITplCompletionItemProvider
} from "./tpl";

export class TplParser {
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
