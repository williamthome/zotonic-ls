import { immutable } from '@/common/functional-programming';
import { joinWithBreakLine } from '@/common/utils';

export function buildSnippet(args: {
    label: string;
    body?: string | [string, ...string[]];
    description?: string;
    documentation?: string;
    triggerCharacters?: string[];
}) {
    return immutable({
        label: args.label,
        body: args.body ? joinWithBreakLine(args.body) : args.label,
        description: args.description ?? '',
        documentation: args.documentation ?? '',
        triggerCharacters: args.triggerCharacters ?? [],
    });
}

export type Snippet = ReturnType<typeof buildSnippet>;
