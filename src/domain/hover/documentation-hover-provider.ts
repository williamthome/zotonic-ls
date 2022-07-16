import { buildHttpRequestArgs, HttpRequest } from '../http';
import { buildPopUp } from '../pop-up';
import { buildHoverProvider } from './hover-provider';

export function buildDocumentationHoverProvider(args: {
    regex: RegExp;
    genUrl: (args: { regexMatch: string }) => string;
    httpRequest: HttpRequest<string>;
}) {
    return buildHoverProvider({
        regex: args.regex,
        async getPopUp({ regexMatch }) {
            const url = args.genUrl({ regexMatch });
            const content = await args.httpRequest(
                buildHttpRequestArgs({ url }),
            );
            return content instanceof Error
                ? undefined
                : buildPopUp({
                      text: content,
                      format: 'html',
                  });
        },
    });
}
