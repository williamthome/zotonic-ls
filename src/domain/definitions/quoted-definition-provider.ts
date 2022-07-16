import { buildDefinitionProvider } from './definition-provider';

export function buildQuotedDefinitionProvider(args: {
    extensions: string[];
    locations: string[];
    locationsToIgnore?: string[];
}) {
    return buildDefinitionProvider({
        regex: /((?<=").*?(?="))|((?<=').*?(?='))/,
        ...args,
    });
}
