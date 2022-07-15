import { buildQuotedDefinitionProvider } from '../quoted-definition-provider';

export function buildLibDefinitionProvider() {
    return buildQuotedDefinitionProvider({
        extensions: ['js', 'css'],
        locations: ['**/priv/**/'],
        locationsToIgnore: ['**/priv/templates/**/'],
    });
}
