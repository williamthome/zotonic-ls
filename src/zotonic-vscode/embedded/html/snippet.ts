import { Position, TextDocument } from 'vscode';
import {
    getLanguageService,
    TextDocument as HtmlTextDocument,
} from 'vscode-html-languageservice';
import { ISnippet, ISnippetProvider } from '../../../zotonic/core';
import { EmbeddedSnippetProvider } from '../snippet-provider';

export class HtmlSnippetProvider extends EmbeddedSnippetProvider {
    private _htmlLanguageService = getLanguageService();

    constructor() {
        super({
            // TODO: Improve pattern to suggestions not appear in tpl expressions.
            pattern: /(?=<).*/,
            triggerCharacters: ['<'],
        });
    }

    public getSnippets(
        document: TextDocument,
        position: Position,
    ): ISnippetProvider['getSnippets'] | undefined {
        const range = document.getWordRangeAtPosition(position, this.pattern);
        if (!range || range.isEmpty) {
            return undefined;
        }

        return async (): Promise<ISnippet[]> => {
            const htmlTextDocument = HtmlTextDocument.create(
                document.uri.path,
                document.languageId,
                document.version,
                document.getText(),
            );

            const htmlDocument =
                this._htmlLanguageService.parseHTMLDocument(htmlTextDocument);
            const htmlCompletionList = this._htmlLanguageService.doComplete(
                htmlTextDocument,
                position,
                htmlDocument,
            );
            return htmlCompletionList.items.map((i) => {
                const insertText = i.textEdit?.newText || i.label;
                const snippet: ISnippet = {
                    prefix: i.label,
                    command: {
                        callback: async (commands) => {
                            const currentPosition =
                                await commands.currentPosition();

                            await commands.insertSnippet(insertText);

                            // TODO: Position helper functions.
                            await commands.deleteText(currentPosition, {
                                line: currentPosition.line,
                                column: currentPosition.column + i.label.length,
                            });
                        },
                    },
                };
                return snippet;
            });
        };
    }
}
