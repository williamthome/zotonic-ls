import { ICommand } from '../../core';
import { mGetExpressions } from '../../utils/models';
import { FileSnippetProvider } from '../file-provider';

export class MGetSnippetProvider extends FileSnippetProvider {
    constructor() {
        super({
            extensions: ['erl'],
            workspaces: [['src', 'models']],
            pattern: /(?<={%|{{|%{|\[).*?\bm\.(\w+)?/,
            fileNamePattern() {
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
                            return commands.growlError(mGetResult.message);
                        }

                        const modelExpressions = mGetResult.map(
                            (mGet) => mGet.expression,
                        );

                        commands.getUserChoice(
                            modelExpressions,
                            async (userChoice) => {
                                const i = mGetResult.findIndex(
                                    (mGet) => mGet.expression === userChoice,
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
