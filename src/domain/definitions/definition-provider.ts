import { formatToGlobPattern } from '../../common/utils';
import { ZObj, zObj } from '../z-obj';

export function buildDefinitionProvider(args: {
    regex: RegExp;
    extensions: string[];
    locations: string[];
    locationsToIgnore?: string[];
    transformMatch?: (match: string) => string;
}) {
    return zObj('definitionProvider', {
        regex: args.regex,
        extensions: args.extensions,
        locationPattern: formatToGlobPattern(args.locations),
        locationPatternToIgnore: args.locationsToIgnore
            ? formatToGlobPattern(args.locationsToIgnore)
            : undefined,
        transformMatch: args.transformMatch,
    });
}

export type DefinitionProvider = ZObj<typeof buildDefinitionProvider>;
