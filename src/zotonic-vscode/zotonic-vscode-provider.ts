import {
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    ExtensionContext,
    languages,
    MarkdownString,
} from 'vscode';
import { IFileFinder, ISnippet, ISnippetProvider } from '../zotonic/core';
import { SnippetProvider } from '../zotonic/snippets';
import { Zotonic } from '../zotonic/zotonic';
import { GenCommandName } from './core';
import { EmbeddedSnippetProvider } from './embedded';
import { HtmlSnippetProvider } from './embedded/html';

export class ZotonicVSCodeProvider {
    constructor(public genCommandName: GenCommandName) {}

    public registerProvider(
        fileFinder: IFileFinder,
        context: ExtensionContext,
    ) {
        return (provider: ISnippetProvider | EmbeddedSnippetProvider) => {
            if (
                provider instanceof SnippetProvider ||
                provider instanceof EmbeddedSnippetProvider
            ) {
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
        const register = this.registerProvider(fileFinder, context);
        zotonic.providers.forEach(register);
        register(new HtmlSnippetProvider());
        return this;
    }

    public parseCompletionItem(snippet: ISnippet): CompletionItem {
        const completionItem = new CompletionItem(
            snippet.prefix,
            // TODO: Get kind from snippet
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
        provider: ISnippetProvider | EmbeddedSnippetProvider,
        fileFinder: IFileFinder,
    ): CompletionItemProvider {
        return {
            provideCompletionItems: async (document, position) => {
                if (
                    document.getWordRangeAtPosition(position, provider.pattern)
                ) {
                    let snippets: ISnippet[] | undefined;
                    if (provider instanceof EmbeddedSnippetProvider) {
                        const getSnippets = provider.getSnippets(
                            document,
                            position,
                        );
                        snippets = getSnippets
                            ? await getSnippets(fileFinder)
                            : undefined;
                    } else {
                        snippets = await provider.getSnippets(fileFinder);
                    }

                    return snippets?.map((s) => this.parseCompletionItem(s));
                }
            },
        };
    }
}
