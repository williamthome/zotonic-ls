import { PopUp } from '../pop-up';

export function buildHoverProvider(args: {
    regex: RegExp;
    getPopUp: (args: { regexMatch: string }) => Promise<PopUp | undefined>;
}) {
    return {
        regex: args.regex,
        getPopUp: args.getPopUp,
    };
}

export type HoverProvider = ReturnType<typeof buildHoverProvider>;
