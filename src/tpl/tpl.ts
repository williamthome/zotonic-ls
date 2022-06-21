import { ITplCommand } from "./commands";
import { ITplCompletionItemProvider } from "./completions";
import {
    ImageCompletionItemProvider,
    MGetCompletionItemProvider,
    TemplateCompletionItemProvider
} from "./completions/itemProviders";
import { ModelCompletionItemProvider } from "./completions/itemProviders/modelCompletionItemProvider";

interface ConstructorArgs {
    providers?: ITplCompletionItemProvider[],
    commands?: ITplCommand[],
}

export class Tpl {
    private _providers: ITplCompletionItemProvider[];
    private _commands: ITplCommand[];

    constructor({ providers, commands }: ConstructorArgs = {}) {
        this._providers = providers || [];
        this._commands = commands || [];
    }

    get providers() {
        return this._providers;
    }

    get commands() {
        return this._commands;
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

    public registerCommand(command: ITplCommand) {
        this._commands.push(command);
        return this;
    }
}
