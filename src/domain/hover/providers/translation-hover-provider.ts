import { HttpRequest } from '@/domain/http';
import { buildDocumentationHoverProvider } from '../documentation-hover-provider';

export function buildTranslationHoverProvider(args: {
    host: string;
    httpGet: HttpRequest<string>;
}) {
    return buildDocumentationHoverProvider({
        regex: /(?=\{_\s).*?(?:\s_\})/,
        genUrl() {
            return `${args.host}/developer-guide/translation.rst`;
        },
        httpRequest: args.httpGet,
    });
}
