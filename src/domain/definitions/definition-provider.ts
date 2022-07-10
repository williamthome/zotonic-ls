import { immutable } from '@/common/functional-programming';
import { formatToGlobPattern } from '@/common/utils';

export function buildDefinitionProvider(args: {
    regex: RegExp;
    extensions: string[];
    locations: string[];
    locationsToIgnore?: string[];
}) {
    return immutable({
        regex: args.regex,
        extensions: args.extensions,
        locationPattern: formatToGlobPattern(args.locations),
        locationPatternToIgnore: args.locationsToIgnore
            ? formatToGlobPattern(args.locationsToIgnore)
            : undefined,
    });
}

export type DefinitionProvider = ReturnType<typeof buildDefinitionProvider>;
