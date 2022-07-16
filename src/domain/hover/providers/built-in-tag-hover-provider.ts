import { HttpRequest } from '../../../domain/http';
import { buildDocumentationHoverProvider } from '../documentation-hover-provider';

export function buildBuiltInTagHoverProvider(args: {
    host: string;
    httpRequest: HttpRequest<string>;
}) {
    return buildDocumentationHoverProvider({
        regex: /(?<={%\s*(optional\s*)?)(all\s+catinclude|all\s+include|autoescape|block|cache|call|catinclude|comment|cycle|extends|filter|firstof|for|if|if d|ifchanged|ifequal|ifnotequal|image|image_data_url|image_url|include|inherit|javascript|javascript|lib|load|media|now|overrules|print|raw|regroup|spaceless|templatetag|trans|trans_ext|url|with)/,
        genUrl({ regexMatch: tag }) {
            const escaped = escapeBuiltInTag(tag);
            return `${args.host}/ref/tags/tag_${escaped}.rst`;
        },
        httpRequest: args.httpRequest,
    });
}

export function escapeBuiltInTag(tag: string) {
    return tag.replace(/\s+/g, '-');
}
