import { Snippet, SnippetProvider } from '@/domain/snippets';
import {
    CompletionItem,
    CompletionItemProvider,
    ExtensionContext,
    languages,
} from 'vscode';
import { zotonicCommandToVSCode } from './command';
import { formatDoc } from './utils';

export function registerSnippetProvider(args: {
    selector: string;
    context: ExtensionContext;
}) {
    return function (snippetProvider: SnippetProvider) {
        args.context.subscriptions.push(
            languages.registerCompletionItemProvider(
                args.selector,
                snippetProviderToVSCode(snippetProvider),
                ...snippetProvider.triggerCharacters,
            ),
        );
    };
}

function snippetProviderToVSCode(
    snippetProvider: SnippetProvider,
): CompletionItemProvider {
    return {
        async provideCompletionItems(document, position) {
            const matchSnippetRegex = document.getWordRangeAtPosition(
                position,
                snippetProvider.regex,
            );

            if (matchSnippetRegex) {
                const snippets = await snippetProvider.getSnippets();
                return snippets.map(snippetToVSCode);
            }
        },
    };
}

function snippetToVSCode(snippet: Snippet): CompletionItem {
    return {
        label: snippet.label,
        insertText: snippet.body,
        detail: snippet.description,
        documentation: formatDoc(snippet.documentation),
        command: snippet.command
            ? zotonicCommandToVSCode(snippet.command)
            : undefined,
    };
}
