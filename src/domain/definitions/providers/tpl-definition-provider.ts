import { buildQuotedDefinitionProvider } from '../quoted-definition-provider';

export function buildTplDefinitionProvider() {
    return buildQuotedDefinitionProvider({
        extensions: ['tpl'],
        locations: ['**/priv/templates/**/'],
    });
}
