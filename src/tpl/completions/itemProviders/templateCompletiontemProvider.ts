import { TplFileCompletionItemProvider } from "../tplFileCompletionItemProvider";

export class TemplateCompletionItemProvider extends TplFileCompletionItemProvider {
    constructor() {
        super({
            extensions: ["tpl"],
            roots: [
                ["priv", "templates"]
            ],
            pattern: /(?<={%\s*(extends|(all\s*)?((cat)?include))\s*\").*?(?=")/
        });
    }
}
