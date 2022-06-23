import { ExtensionContext } from 'vscode';
import { Zotonic } from '../zotonic/zotonic';
import { ZotonicVSCodeCommand } from './zotonic-vscode-command';
import { ZotonicVSCodeProvider } from './zotonic-vscode-provider';
import { ZotonicVSCodeHover } from './zotonic-vscode-hover';

export class ZotonicVSCode {
    public commands: ZotonicVSCodeCommand;
    public providers: ZotonicVSCodeProvider;
    public hover: ZotonicVSCodeHover;

    constructor() {
        this.commands = new ZotonicVSCodeCommand();
        this.providers = new ZotonicVSCodeProvider(
            this.commands.genCommandName,
        );
        this.hover = new ZotonicVSCodeHover();
    }

    public setup(zotonic: Zotonic, context: ExtensionContext) {
        this.commands.registerCommands(context);
        this.providers.registerProviders(zotonic, context);
        this.hover.registerProviders(
            zotonic,
            this.commands.tplCommands,
            context,
        );
    }
}
