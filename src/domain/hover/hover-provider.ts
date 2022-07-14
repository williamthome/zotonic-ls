import { PopUp } from '../pop-up';

export function buildHoverProvider(args: {
    regex: RegExp;
    getContent: (args: { regexMatch: string }) => Promise<PopUp | undefined>;
}) {
    return {
        regex: args.regex,
        getContent: args.getContent,
    };
}

export type HoverProvider = ReturnType<typeof buildHoverProvider>;
