import { ITplCompletionItemProvider } from "./completions";
import {
    ImageCompletionItemProvider,
    MGetCompletionItemProvider,
    TemplateCompletionItemProvider
} from "./completions/itemProviders";
import { ModelCompletionItemProvider } from "./completions/itemProviders/modelCompletionItemProvider";

interface ConstructorArgs {
    providers?: ITplCompletionItemProvider[],
}

export class Tpl {
    private _providers: ITplCompletionItemProvider[];

    constructor({ providers }: ConstructorArgs = {}) {
        this._providers = providers || [];
    }

    get providers() {
        return this._providers;
    }

    public async setup() {
        return this
            .registerProvider(new TemplateCompletionItemProvider())
            .registerProvider(new ImageCompletionItemProvider())
            .registerProvider(new ModelCompletionItemProvider())
            .registerProvider(new MGetCompletionItemProvider())
        ;
    }

    public registerProvider(provider: ITplCompletionItemProvider) {
        this._providers.push(provider);
        return this;
    }
}
