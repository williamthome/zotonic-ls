import { immutable } from '../fp';
import { Args } from '../types';
import { Snippet } from './snippet';

export type GetSnippets = () => Promise<Snippet[]>;

export function buildSnippetProvider(args: {
    regex: RegExp;
    triggerCharacters?: string[];
    getSnippets: GetSnippets;
}) {
    let _snippets: Snippet[] | undefined = undefined;

    return immutable({
        regex: args.regex,
        triggerCharacters: args.triggerCharacters ?? ['.'],
        async getSnippets() {
            if (!_snippets) {
                _snippets = await args.getSnippets();
            }
            return _snippets;
        },
        flush() {
            _snippets = undefined;
        },
    });
}

type BuildSnippetProvider = typeof buildSnippetProvider;
export type SnippetProviderArgs = Args<BuildSnippetProvider>;
export type SnippetProvider = ReturnType<BuildSnippetProvider>;
