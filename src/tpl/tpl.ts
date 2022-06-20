import { ITplCommand } from "./commands";
import {
    ImageCompletionItemProvider,
    ModelCompletionItemProvider,
    TemplateCompletionItemProvider
} from "./completions/itemProviders";
import { TplProvider } from "./tplProvider";

interface ConstructorArgs {
    providers?: TplProvider[],
    commands?: ITplCommand[],
}

export class Tpl {
    private _providers: TplProvider[];
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
        ;
    }

    public registerProvider(provider: TplProvider) {
        this._providers.push(provider);
        return this;
    }

    public registerCommand(command: ITplCommand) {
        this._commands.push(command);
        return this;
    }
}
