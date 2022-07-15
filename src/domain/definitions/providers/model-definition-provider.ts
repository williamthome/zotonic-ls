import { buildDefinitionProvider } from '../definition-provider';

export function buildModelDefinitionProvider() {
    return buildDefinitionProvider({
        regex: /(?<=\bm\.)\w+/,
        extensions: ['erl'],
        locations: ['**/src/models/**/m_'],
        transformMatch: function (model) {
            return `${model}.erl`;
        },
    });
}
