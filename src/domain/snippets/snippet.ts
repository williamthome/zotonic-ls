import { joinWithBreakLine } from '@/common/utils';
import { CommandCallback } from '../commands';
import { buildPopUp, PopUpArgs } from '../pop-up';
import { ZObj, zObj } from '../z-obj';

export function buildSnippet(args: {
    label: string;
    body?: string | [string, ...string[]];
    description?: string;
    documentation?: PopUpArgs;
    triggerCharacters?: string[];
    command?: CommandCallback;
}) {
    return zObj('snippet', {
        label: args.label,
        body:
            args.body !== undefined ? joinWithBreakLine(args.body) : args.label,
        description: args.description ?? '',
        documentation: buildPopUp(args.documentation ?? ''),
        triggerCharacters: args.triggerCharacters ?? [],
        command: args.command,
    });
}

export type Snippet = ZObj<typeof buildSnippet>;
