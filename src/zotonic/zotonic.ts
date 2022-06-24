import { IDefinitionProvider, IHoverProvider, ISnippetProvider } from './core';
import { TplDefinitionProvider } from './definition';
import {
    ModuleTagHoverProvider,
    BuiltinTagHoverProvider,
    ActionHoverProvider,
    FilterHoverProvider,
    ValidatorHoverProvider,
    ModelHoverProvider,
    TranslationHoverProvider,
} from './hover/providers';
import {
    TagImageSnippetProvider,
    MGetSnippetProvider,
    ModelSnippetProvider,
    TagTemplateSnippetProvider,
} from './snippets/providers';

interface ConstructorArgs {
    providers?: ISnippetProvider[];
    hovers?: IHoverProvider[];
    definitions?: IDefinitionProvider[];
    docHost: string;
}

export class Zotonic {
    private _providers: ISnippetProvider[];
    private _hovers: IHoverProvider[];
    private _definitions: IDefinitionProvider[];
    private _docHost: string;

    constructor({ providers, hovers, definitions, docHost }: ConstructorArgs) {
        this._providers = providers || [];
        this._hovers = hovers || [];
        this._definitions = definitions || [];
        this._docHost = docHost;
    }

    get providers() {
        return this._providers;
    }

    get hovers() {
        return this._hovers;
    }

    get definitions() {
        return this._definitions;
    }

    public setup() {
        return this.setupSnippets().setupHovers().setupDefinitions();
    }

    public registerSnippet(provider: ISnippetProvider) {
        this._providers.push(provider);
        return this;
    }

    public registerHover(hover: IHoverProvider) {
        this._hovers.push(hover);
        return this;
    }

    public registerDefinition(definition: IDefinitionProvider) {
        this._definitions.push(definition);
        return this;
    }

    private setupSnippets() {
        return this.registerSnippet(new TagTemplateSnippetProvider())
            .registerSnippet(new TagImageSnippetProvider())
            .registerSnippet(new MGetSnippetProvider())
            .registerSnippet(new ModelSnippetProvider());
    }

    private setupHovers() {
        const host = this._docHost;
        const args = { host };

        return this.registerHover(new BuiltinTagHoverProvider(args))
            .registerHover(new ModuleTagHoverProvider(args))
            .registerHover(new ActionHoverProvider(args))
            .registerHover(new FilterHoverProvider(args))
            .registerHover(new ValidatorHoverProvider(args))
            .registerHover(new ModelHoverProvider(args))
            .registerHover(new TranslationHoverProvider(args));
    }

    public setupDefinitions() {
        const ignoreLocations = ['**/_build/**'];
        const args = { ignoreLocations };

        return this.registerDefinition(new TplDefinitionProvider(args));
    }
}
