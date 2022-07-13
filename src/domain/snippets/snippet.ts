import { immutable } from '@/common/functional-programming';
import { joinWithBreakLine } from '@/common/utils';
import { CommandCallback } from '../commands';
import { buildDoc, DocArgs } from '../doc';

export function buildSnippet(args: {
    label: string;
    body?: string | [string, ...string[]];
    description?: string;
    documentation?: DocArgs;
    triggerCharacters?: string[];
    command?: CommandCallback;
}) {
    return immutable({
        label: args.label,
        body: args.body ? joinWithBreakLine(args.body) : args.label,
        description: args.description ?? '',
        documentation: buildDoc(args.documentation ?? ''),
        triggerCharacters: args.triggerCharacters ?? [],
        command: args.command,
    });
}

export type Snippet = ReturnType<typeof buildSnippet>;
