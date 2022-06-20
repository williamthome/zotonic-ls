import { ITplCommand } from "../../commands";
import { TplFileCompletionItemProvider } from "../tplFileCompletionItemProvider";

export class ModelCompletionItemProvider extends TplFileCompletionItemProvider {
    constructor() {
        super({
            extensions: ["erl"],
            roots: [["src", "models"]],
            // TODO: Improve pattern
            // pattern: /(?<=({%|{{|%{|\[).*?\bm\. ).*?(?=/,
            pattern: /\bm\.(\w+)?/,
            filenameRegExp() {
                return /(?<=\bm_).*?(?=.erl)/;
            },
            transformSnippet(snippet) {
                snippet.description = "A model located at '<apps|apps_user>/<module>/src/models'.";
                // TODO: Snippet command
                // const modelExpressionsFinder = (m: string) => mGetExpressions(findFile, m);
                const modelSnippets = [
                    "m.test[$1]",
                    "m.test2[$1]",
                    "m.test3[$1]",
                ];

                snippet.command = {
                    name: "m_get",
                    callback: async (commands: ITplCommand) => {
                        commands.getUserChoice(modelSnippets, async (snippet) => {
                            console.log("model", snippet);
                            await commands.insertSnippet(snippet);
                        });
                    }
                };

                return snippet;
            },
        });
    }
}
