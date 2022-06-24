import { ExtensionContext } from 'vscode';
import { Zotonic } from '../zotonic/zotonic';
import { ZotonicVSCodeCommand } from './zotonic-vscode-command';
import { ZotonicVSCodeProvider } from './zotonic-vscode-provider';
import { ZotonicVSCodeHover } from './zotonic-vscode-hover';
import { ZotonicVSCodeFileFinder } from './zotonic-vscode-file-finder';

export class ZotonicVSCode {
    public commands: ZotonicVSCodeCommand;
    public providers: ZotonicVSCodeProvider;
    public hover: ZotonicVSCodeHover;
    public fileFinder: ZotonicVSCodeFileFinder;

    constructor() {
        this.commands = new ZotonicVSCodeCommand();
        this.providers = new ZotonicVSCodeProvider(
            this.commands.genCommandName,
        );
        this.hover = new ZotonicVSCodeHover();
        this.fileFinder = new ZotonicVSCodeFileFinder();
    }

    public setup(zotonic: Zotonic, context: ExtensionContext) {
        this.commands.registerCommands(context);
        this.providers.registerProviders(zotonic, this.fileFinder, context);
        this.hover.registerProviders(
            zotonic,
            this.commands.tplCommands,
            context,
        );
    }
}
