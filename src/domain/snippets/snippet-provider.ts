import { buildBag } from '@/common/bag';
import { immutable } from '@/common/functional-programming';
import { Args } from '@/common/types';
import { Snippet } from './snippet';

export type GetSnippets = () => Promise<Snippet[]>;

export function buildSnippetProvider(args: {
    regex: RegExp;
    triggerCharacters?: string[];
    getSnippets: GetSnippets;
}) {
    const _snippetsBag = buildBag<Snippet[]>({
        fetchContent: args.getSnippets,
    });

    return immutable({
        regex: args.regex,
        triggerCharacters: args.triggerCharacters ?? ['.'],
        getSnippets: _snippetsBag.getContent,
        flush: _snippetsBag.flush,
    });
}

type BuildSnippetProvider = typeof buildSnippetProvider;
export type SnippetProviderArgs = Args<BuildSnippetProvider>;
export type SnippetProvider = ReturnType<BuildSnippetProvider>;
