import { buildQuotedDefinitionProvider } from '../quoted-definition-provider';

export function buildStyleDefinitionProvider() {
    return buildQuotedDefinitionProvider({
        extensions: ['css'],
        locations: ['**/priv/lib/css/**/'],
    });
}
