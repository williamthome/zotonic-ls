import { ICommand } from '../../core';
import { mGetExpressions } from '../../utils/models';
import { FileSnippetProvider } from '../file-provider';

export class MGetSnippetProvider extends FileSnippetProvider {
    constructor() {
        super({
            extensions: ['erl'],
            workspaces: [['src', 'models']],
            // TODO: Improve pattern
            // pattern: /(?<=({%|{{|%{|\[).*?\bm\. ).*?(?=/,
            pattern: /\bm\.(\w+)?/,
            filenameRegExp() {
                return /(?<=\bm_).*?(?=.erl)/;
            },
            transformSnippet(snippet, filePath, model) {
                snippet.description =
                    "A model located at '<apps|apps_user>/<module>/src/models'.";
                snippet.command = {
                    hint: 'm_get',
                    callback: async (commands: ICommand) => {
                        const mGetResult = await mGetExpressions(
                            filePath,
                            model,
                        );
                        if (mGetResult instanceof Error) {
                            // TODO: Show error message
                            return;
                        }

                        const modelExpressions = mGetResult.map(
                            (mGet) => mGet.expression,
                        );

                        commands.getUserChoice(
                            modelExpressions,
                            async (useChoice) => {
                                const i = mGetResult.findIndex(
                                    (mGet) => mGet.expression === useChoice,
                                );
                                const snippet = mGetResult[i].snippet;
                                await commands.insertSnippet(snippet);
                            },
                        );
                    },
                };

                return snippet;
            },
        });
    }
}
