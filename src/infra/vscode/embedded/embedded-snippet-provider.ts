import { immutable } from '@/common/functional-programming';
import { Snippet } from '@/domain/snippets';
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
    return immutable({
        // TODO: Add __kind__ to all objects
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __kind__: 'embeddedSnippetProvider',
        regex: args.regex,
        triggerCharacters: args.triggerCharacters ?? ['.'],
        getSnippets: args.getSnippets,
    });
}

export type EmbeddedSnippetProvider = ReturnType<
    typeof buildEmbeddedSnippetProvider
>;

export function isEmbeddedSnippetProvider(
    payload: unknown,
): payload is EmbeddedSnippetProvider {
    if (!payload) {
        return false;
    }
    const esp = payload as EmbeddedSnippetProvider;
    return esp.__kind__ === 'embeddedSnippetProvider';
}
