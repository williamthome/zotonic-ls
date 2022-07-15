import { isKindOf, ZObj, zObj } from '../../../domain/z-obj';
import { Snippet } from '../../../domain/snippets';
import { Position, TextDocument } from 'vscode';

interface GetEmbeddedSnippetsArgs {
    document: TextDocument;
    position: Position;
}

export type GetEmbeddedSnippets = (
    args: GetEmbeddedSnippetsArgs,
) => Promise<Snippet[]>;

export function buildEmbeddedSnippetProvider(args: {
    regex: RegExp;
    triggerCharacters?: string[];
    getSnippets: GetEmbeddedSnippets;
}) {
    return zObj('embeddedSnippetProvider', {
        regex: args.regex,
        triggerCharacters: args.triggerCharacters ?? ['.'],
        getSnippets: args.getSnippets,
    });
}

export type EmbeddedSnippetProvider = ZObj<typeof buildEmbeddedSnippetProvider>;

export function isEmbeddedSnippetProvider(
    x: unknown,
): x is EmbeddedSnippetProvider {
    return isKindOf('embeddedSnippetProvider', x);
}
