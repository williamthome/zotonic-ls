import { ISnippetProvider } from "./core";
import {
    ImageSnippetProvider,
    MGetSnippetProvider,
    ModelSnippetProvider,
    TemplateSnippetProvider
} from "./snippets/providers";

interface ConstructorArgs {
    providers?: ISnippetProvider[],
}

export class Zotonic {
    private _providers: ISnippetProvider[];

    constructor({ providers }: ConstructorArgs = {}) {
        this._providers = providers || [];
    }

    get providers() {
        return this._providers;
    }

    public async setup() {
        return this
            .registerProvider(new TemplateSnippetProvider())
            .registerProvider(new ImageSnippetProvider())
            .registerProvider(new ModelSnippetProvider())
            .registerProvider(new MGetSnippetProvider())
        ;
    }

    public registerProvider(provider: ISnippetProvider) {
        this._providers.push(provider);
        return this;
    }
}
