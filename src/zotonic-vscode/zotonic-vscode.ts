import { ExtensionContext } from 'vscode';
import { Zotonic } from '../zotonic/zotonic';
import { ZotonicVSCodeCommand } from './zotonic-vscode-command';
import { ZotonicVSCodeProvider } from './zotonic-vscode-provider';

export class ZotonicVSCode {
    public commands: ZotonicVSCodeCommand;
    public providers: ZotonicVSCodeProvider;

    constructor() {
        this.commands = new ZotonicVSCodeCommand();
        this.providers = new ZotonicVSCodeProvider(
            this.commands.genCommandName,
        );
    }

    public setup(zotonic: Zotonic, context: ExtensionContext) {
        this.commands.registerCommands(context);
        this.providers.registerProviders(zotonic, context);
    }
}
