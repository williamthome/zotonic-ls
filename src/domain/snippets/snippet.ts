import { immutable } from '@/common/functional-programming';
import { joinWithBreakLine } from '@/common/utils';
import { CommandCallback } from '../commands';
import { buildPopUp, PopUpArgs } from '../pop-up';

export function buildSnippet(args: {
    label: string;
    body?: string | [string, ...string[]];
    description?: string;
    documentation?: PopUpArgs;
    triggerCharacters?: string[];
    command?: CommandCallback;
}) {
    return immutable({
        label: args.label,
        body:
            args.body !== undefined ? joinWithBreakLine(args.body) : args.label,
        description: args.description ?? '',
        documentation: buildPopUp(args.documentation ?? ''),
        triggerCharacters: args.triggerCharacters ?? [],
        command: args.command,
    });
}

export type Snippet = ReturnType<typeof buildSnippet>;
