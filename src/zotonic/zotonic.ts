import { ISnippetProvider } from './core';
import {
    TagImageSnippetProvider,
    MGetSnippetProvider,
    ModelSnippetProvider,
    TagTemplateSnippetProvider,
} from './snippets/providers';

interface ConstructorArgs {
    providers?: ISnippetProvider[];
}

export class Zotonic {
    private _providers: ISnippetProvider[];

    constructor({ providers }: ConstructorArgs = {
}) {
        this._providers = providers || [];
    }

    get providers() {
        return this._providers;
    }

    public setup() {
        return this.registerProvider(new TagTemplateSnippetProvider())
            .registerProvider(new TagImageSnippetProvider())
            .registerProvider(new MGetSnippetProvider())
            .registerProvider(new ModelSnippetProvider());
    }

    public registerProvider(provider: ISnippetProvider) {
        this._providers.push(provider);
        return this;
    }
}
