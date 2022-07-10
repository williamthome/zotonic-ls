import { HttpRequest } from '@/domain/http';
import { buildDocumentationHoverProvider } from '../documentation-hover-provider';

export function buildModuleTagHoverProvider(args: {
    host: string;
    httpGet: HttpRequest<string>;
}) {
    return buildDocumentationHoverProvider({
        regex: /(?<={%\s*)(button|chart_pie|chart_pie3d|cotonic_pathname_search|debug|draggable|droppable|google_chart|inplace_textbox|lazy|live|loremipsum|mailinglist_subscribe|menu|pager|poll|script|sortable|sorter|spinner|tabs|validate|wire|wire_args|worker)/,
        genUrl({ regexMatch: scomp }) {
            return `${args.host}/ref/scomps/scomp_${scomp}.rst`;
        },
        httpRequest: args.httpGet,
    });
}
