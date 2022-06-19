import { ImageCompletionItemProvider, TemplateCompletionItemProvider } from "./completions/itemProviders";
import { TplProvider } from "./tplProvider";

interface ConstructorArgs {
    providers?: TplProvider[]
}

export class Tpl {
    private _providers: TplProvider[];

    constructor({ providers }: ConstructorArgs = {}) {
        this._providers = providers || [];
    }

    get providers() {
        return this._providers;
    }

    public async setup() {
        return this
            .registerProvider(new TemplateCompletionItemProvider())
            .registerProvider(new ImageCompletionItemProvider());
    }

    public registerProvider(provider: TplProvider) {
        this._providers.push(provider);
        return this;
    }
}
