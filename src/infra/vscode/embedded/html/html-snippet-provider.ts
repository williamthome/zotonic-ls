import {
    LanguageService,
    TextDocument as HtmlTextDocument,
} from 'vscode-html-languageservice';
import { buildEmbeddedSnippetProvider } from '../embedded-snippet-provider';
import { buildSnippet } from '@/domain/snippets';

export function buildHtmlSnippetProvider(args: {
    htmlLanguageService: LanguageService;
}) {
    return buildEmbeddedSnippetProvider({
        regex: /(?=<).*/,
        triggerCharacters: ['<'],
        getSnippets: async function ({ document, position }) {
            const range = document.getWordRangeAtPosition(position, this.regex);
            if (!range || range.isEmpty) {
                return [];
            }

            const htmlTextDocument = HtmlTextDocument.create(
                document.uri.path,
                document.languageId,
                document.version,
                document.getText(),
            );

            const htmlDocument =
                args.htmlLanguageService.parseHTMLDocument(htmlTextDocument);
            const htmlCompletionList = args.htmlLanguageService.doComplete(
                htmlTextDocument,
                position,
                htmlDocument,
            );

            return htmlCompletionList.items.map((i) => {
                const snippet = buildSnippet({
                    label: i.label,
                });
                return snippet;
            });
        },
    });
}
