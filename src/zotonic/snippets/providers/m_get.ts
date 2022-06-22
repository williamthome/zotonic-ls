import { ICommand } from '../../core';
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
            transformSnippet(snippet, filePath) {
                snippet.description =
                    "A model located at '<apps|apps_user>/<module>/src/models'.";
                // TODO: Snippet command
                // const modelExpressionsFinder = (m: string) => mGetExpressions(findFile, m);
                const modelSnippets = [
                    'm.test[$1]',
                    'm.test2[$1]',
                    'm.test3[$1]',
                ];

                console.log(filePath);

                snippet.command = {
                    hint: 'm_get',
                    callback: async (commands: ICommand) => {
                        commands.getUserChoice(
                            modelSnippets,
                            async (choice) => {
                                console.log('model', choice);
                                await commands.insertSnippet(choice);
                            },
                        );
                    },
                };

                return snippet;
            },
        });
    }
}
