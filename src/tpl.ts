import { Disposable, ExtensionContext, languages } from "vscode";
import { TemplateCompletionItemProvider } from "./completions/itemProviders";
import {
    ITplCompletionItemProvider,
    TplCompletionItemProvider
} from "./completions/tplCompletionItemProvider";

type TplDisposable =
    Disposable
    | TplCompletionItemProvider;

export class Tpl {
    constructor(public context: ExtensionContext) {}

    public setup() {
        this.subscribe(new TemplateCompletionItemProvider());
    }

    public subscribe(disposable: TplDisposable) {
        if (disposable instanceof TplCompletionItemProvider) {
            this.doSubscribe(this.registerCompletionItemProvider(disposable));
        } else {
            this.doSubscribe(disposable);
        }
        return this;
    }

    public registerCompletionItemProvider(completionItemProvider: ITplCompletionItemProvider) {
        return languages.registerCompletionItemProvider(
            completionItemProvider.selector,
            completionItemProvider
        );
    }

    // Internal functions

    private doSubscribe(disposable: Disposable) {
        this.context.subscriptions.push(disposable);
    }
}
