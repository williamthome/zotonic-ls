import { buildHttpRequestArgs, HttpRequest } from '../http';
import { buildHoverProvider } from './hover-provider';

export function buildDocumentationHoverProvider(args: {
    regex: RegExp;
    genUrl: (args: { regexMatch: string }) => string;
    httpRequest: HttpRequest<string>;
}) {
    return buildHoverProvider({
        regex: args.regex,
        async getContent({ regexMatch }) {
            const url = args.genUrl({ regexMatch });
            const content = await args.httpRequest(
                buildHttpRequestArgs({ url }),
            );
            return content instanceof Error
                ? undefined
                : {
                      text: content,
                      format: 'html',
                  };
        },
    });
}
