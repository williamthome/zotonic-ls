import { TplFileCompletionItemProvider } from "../tplFileCompletionItemProvider";

export class TemplateCompletionItemProvider extends TplFileCompletionItemProvider {
    constructor() {
        super({
            extension: "tpl",
            root: ["priv", "templates"],
            pattern: /(?<={%\s*(extends|(all\s*)?((cat)?include))\s*\").*?(?=")/
        });
    }
}
