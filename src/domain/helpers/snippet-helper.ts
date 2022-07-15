import { ZObj, zObj } from '../z-obj';

export function buildSnippetToken(args: {
    token: string;
    editable?: boolean;
    prefix?: string;
    suffix?: string;
}) {
    return zObj('snippetToken', {
        token: args.token,
        editable: args.editable ?? false,
        prefix: args.prefix ?? '',
        suffix: args.suffix ?? '',
    });
}

export type SnippetToken = ZObj<typeof buildSnippetToken>;

export function reduceSnippetTokens(tokens: SnippetToken[]) {
    return tokens.reduce((acc, { token, editable, prefix, suffix }, i) => {
        const mid = editable
            ? buildSnippetParam({ index: i + 1, default: token })
            : token;
        const text = `${prefix}${mid}${suffix}`;
        return acc + text;
    }, '');
}

export function buildSnippetParam(args: { index: number; default?: string }) {
    return args.default
        ? `\${${args.index}:${args.default}}`
        : `\\$${args.index}`;
}
