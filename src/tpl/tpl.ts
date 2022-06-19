import { TemplateCompletionItemProvider } from "./completions/itemProviders";
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
        this.registerProvider(new TemplateCompletionItemProvider());
        return this;
    }

    public registerProvider(provider: TplProvider) {
        this._providers.push(provider);
        return this;
    }
}
