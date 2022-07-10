import { Doc } from '../doc';

export function buildHoverProvider(args: {
    regex: RegExp;
    getContent: (args: { regexMatch: string }) => Promise<Doc | undefined>;
}) {
    return {
        regex: args.regex,
        getContent: args.getContent,
    };
}

export type HoverProvider = ReturnType<typeof buildHoverProvider>;
