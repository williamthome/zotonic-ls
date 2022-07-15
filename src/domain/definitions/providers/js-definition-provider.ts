import { buildQuotedDefinitionProvider } from '../quoted-definition-provider';

export function buildJsDefinitionProvider() {
    return buildQuotedDefinitionProvider({
        extensions: ['js'],
        locations: ['**/priv/lib/js/**/', '**/priv/lib/cotonic/**/'],
    });
}
