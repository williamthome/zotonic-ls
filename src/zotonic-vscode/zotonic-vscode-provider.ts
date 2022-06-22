import {
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    ExtensionContext,
    languages,
    MarkdownString,
    Position,
    TextDocument,
    window,
    workspace,
} from 'vscode';
import { ISnippet, ISnippetProvider } from '../zotonic/core';
import { SnippetProvider } from '../zotonic/snippets';
import { Zotonic } from '../zotonic/zotonic';
import { GenCommandName } from './core';

export class ZotonicVSCodeProvider {
    constructor(public genCommandName: GenCommandName) {}

    public async setup(zotonic: Zotonic, context: ExtensionContext) {
        this.registerProviders(zotonic, context);
    }

    public registerProvider(context: ExtensionContext) {
        return (provider: ISnippetProvider) => {
            if (provider instanceof SnippetProvider) {
                context.subscriptions.push(
                    languages.registerCompletionItemProvider(
                        provider.selector,
                        this.parseCompletionItemProvider(provider),
                        ...provider.triggerCharacters,
                    ),
                );
            } else {
                throw new Error('Provider not implemented.');
            }
        };
    }

    public registerProviders(zotonic: Zotonic, context: ExtensionContext) {
        zotonic.providers.forEach(this.registerProvider(context));
        return this;
    }

    public parseCompletionItem(snippet: ISnippet): CompletionItem {
        const completionItem = new CompletionItem(
            snippet.prefix,
            CompletionItemKind.Snippet,
        );
        completionItem.insertText = Array.isArray(snippet.body)
            ? snippet.body.join('\n')
            : snippet.body;
        completionItem.detail = snippet.description;

        if (snippet.documentation) {
            const documentation = new MarkdownString(
                snippet.documentation.trim(),
            );
            documentation.supportHtml = true;
            documentation.isTrusted = true;
            completionItem.documentation = documentation;
        }

        if (snippet.command) {
            completionItem.command = {
                command: this.genCommandName('executeCommand'),
                title: snippet.command.hint || snippet.prefix,
                arguments: [snippet.command.callback],
            };
        }

        return completionItem;
    }

    public parseCompletionItemProvider(
        provider: ISnippetProvider,
    ): CompletionItemProvider {
        const provideCompletionItems = async (
            document: TextDocument,
            position: Position,
        ): Promise<CompletionItem[] | undefined> => {
            if (document.getWordRangeAtPosition(position, provider.pattern)) {
                // TODO: Snippets cache
                const baseDir = this.getDocumentWorkspaceFolder() || __dirname;
                const snippets = await provider.getSnippets(baseDir);

                return snippets.map((s) => this.parseCompletionItem(s));
            }
        };
        return {
            provideCompletionItems,
        };
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
