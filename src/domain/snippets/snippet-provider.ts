import { buildBag } from '@/common/bag';
import { Args } from '@/common/types';
import { ZObj, zObj } from '../z-obj';
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

    return zObj('snippetProvider', {
        regex: args.regex,
        triggerCharacters: args.triggerCharacters ?? ['.'],
        getSnippets: _snippetsBag.getContent,
        flush: _snippetsBag.flush,
    });
}

type BuildSnippetProvider = typeof buildSnippetProvider;

export type SnippetProviderArgs = Args<BuildSnippetProvider>;

export type SnippetProvider = ZObj<BuildSnippetProvider>;
