import { TplCompletionItemProvider } from "../tplCompletionItemProvider";
import { ITplSnippet } from "../tplSnippet";

export class ModelCompletionItemProvider extends TplCompletionItemProvider {
    constructor() {
        super({
            selector: "tpl",
            pattern: /\bm\b/,
        });
    }

    public loadSnippets(): Promise<ITplSnippet[]> {
        return new Promise((resolve) => {
            resolve([{
                prefix: "m.",
                description: "Provide data to templates.",
                command: {
                    callback: (commands) => commands.showUpSnippets()
                },
            }]);
        });
    }
}
