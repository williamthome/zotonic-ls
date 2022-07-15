import { buildQuotedDefinitionProvider } from '../quoted-definition-provider';

export function buildImageDefinitionProvider() {
    return buildQuotedDefinitionProvider({
        extensions: [
            'apng',
            'gif',
            'ico',
            'cur',
            'jpg',
            'jpeg',
            'jfif',
            'pjpeg',
            'pjp',
            'png',
            'svg',
        ],
        locations: ['**/priv/lib/images/**/'],
    });
}
