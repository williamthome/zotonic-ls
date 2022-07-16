import { Snippet, SnippetProvider } from '../../domain/snippets';
import {
    CompletionItem,
    CompletionItemProvider,
    ExtensionContext,
    languages,
    Position,
    TextDocument,
} from 'vscode';
import { zotonicCommandToVSCode } from './command';
import { EmbeddedSnippetProvider, isEmbeddedSnippetProvider } from './embedded';
import { formatPopUp } from './utils';

type UnknownSnippetProvider = SnippetProvider | EmbeddedSnippetProvider;

export function registerSnippetProvider(args: {
    selector: string;
    context: ExtensionContext;
}) {
    return function (snippetProvider: UnknownSnippetProvider) {
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
    snippetProvider: UnknownSnippetProvider,
): CompletionItemProvider {
    return {
        async provideCompletionItems(document, position) {
            const matchSnippetRegex = document.getWordRangeAtPosition(
                position,
                snippetProvider.regex,
            );

            if (matchSnippetRegex) {
                const snippets = await getSnippets({
                    snippetProvider,
                    document,
                    position,
                });
                return snippets.map(snippetToVSCode);
            }
        },
    };
}

async function getSnippets(args: {
    snippetProvider: UnknownSnippetProvider;
    document: TextDocument;
    position: Position;
}): Promise<Snippet[]> {
    if (isEmbeddedSnippetProvider(args.snippetProvider)) {
        return args.snippetProvider.getSnippets({
            document: args.document,
            position: args.position,
        });
    }

    // TODO: Check why 'snippetProvider' type is 'never'
    return (args.snippetProvider as SnippetProvider).getSnippets();
}

function snippetToVSCode(snippet: Snippet): CompletionItem {
    return {
        label: snippet.label,
        insertText: snippet.body,
        detail: snippet.description,
        documentation: formatPopUp(snippet.documentation),
        command: snippet.command
            ? zotonicCommandToVSCode(snippet.command)
            : undefined,
    };
}
