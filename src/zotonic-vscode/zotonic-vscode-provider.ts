import {
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    ExtensionContext,
    languages,
    MarkdownString,
    Position,
    TextDocument,
} from 'vscode';
import { IFileFinder, ISnippet, ISnippetProvider } from '../zotonic/core';
import { SnippetProvider } from '../zotonic/snippets';
import { Zotonic } from '../zotonic/zotonic';
import { GenCommandName } from './core';

export class ZotonicVSCodeProvider {
    constructor(public genCommandName: GenCommandName) {}

    public registerProvider(
        fileFinder: IFileFinder,
        context: ExtensionContext,
    ) {
        return (provider: ISnippetProvider) => {
            if (provider instanceof SnippetProvider) {
                context.subscriptions.push(
                    languages.registerCompletionItemProvider(
                        provider.selector,
                        this.parseCompletionItemProvider(provider, fileFinder),
                        ...provider.triggerCharacters,
                    ),
                );
            } else {
                throw new Error('Provider not implemented.');
            }
        };
    }

    public registerProviders(
        zotonic: Zotonic,
        fileFinder: IFileFinder,
        context: ExtensionContext,
    ) {
        zotonic.providers.forEach(this.registerProvider(fileFinder, context));
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
        fileFinder: IFileFinder,
    ): CompletionItemProvider {
        const provideCompletionItems = async (
            document: TextDocument,
            position: Position,
        ): Promise<CompletionItem[] | undefined> => {
            if (document.getWordRangeAtPosition(position, provider.pattern)) {
                const snippets = await provider.getSnippets(fileFinder);
                return snippets.map((s) => this.parseCompletionItem(s));
            }
        };
        return {
            provideCompletionItems,
        };
    }
}
