import { HttpRequest } from '@/domain/http';
import { buildDocumentationHoverProvider } from '../documentation-hover-provider';

export function buildValidatorHoverProvider(args: {
    host: string;
    httpRequest: HttpRequest<string>;
}) {
    return buildDocumentationHoverProvider({
        regex: /(?<=\{%\s*validate\s.*type=\{)(acceptance|confirmation|custom|date|email|email_unique|format|length|name_unique|numericality|postback|presence|username_unique)/s,
        genUrl({ regexMatch: validator }) {
            return `${args.host}/ref/validators/validator_${validator}.rst`;
        },
        httpRequest: args.httpRequest,
    });
}
