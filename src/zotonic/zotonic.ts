import { IHoverProvider, ISnippetProvider } from './core';
import { TagHoverProvider } from './hover/providers';
import {
    TagImageSnippetProvider,
    MGetSnippetProvider,
    ModelSnippetProvider,
    TagTemplateSnippetProvider,
} from './snippets/providers';

interface ConstructorArgs {
    providers?: ISnippetProvider[];
    hovers?: IHoverProvider[];
}

export class Zotonic {
    private _providers: ISnippetProvider[];
    private _hovers: IHoverProvider[];

    constructor({ providers, hovers }: ConstructorArgs = {}) {
        this._providers = providers || [];
        this._hovers = hovers || [];
    }

    get providers() {
        return this._providers;
    }

    get hovers() {
        return this._hovers;
    }

    public setup() {
        return this.setupSnippets().setupHovers();
    }

    public registerSnippet(provider: ISnippetProvider) {
        this._providers.push(provider);
        return this;
    }

    public registerHover(hover: IHoverProvider) {
        this._hovers.push(hover);
        return this;
    }

    private setupSnippets() {
        return this.registerSnippet(new TagTemplateSnippetProvider())
            .registerSnippet(new TagImageSnippetProvider())
            .registerSnippet(new MGetSnippetProvider())
            .registerSnippet(new ModelSnippetProvider());
    }

    private setupHovers() {
        return this.registerHover(new TagHoverProvider());
    }
}
