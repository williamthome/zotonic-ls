import axios from 'axios';
import { ExtensionContext, SnippetString, commands, window } from 'vscode';
import { ICommand, ISnippetCommandCallback } from '../zotonic/core';
import {
    RegisterTplCommand,
    TplCommandName,
    VSCodeCommandName,
    TplCommandArgs,
    TplCommandReturn,
    TplCommandFunction,
    TextEditorCommandCallback,
    CommandKind,
    CommandInterpreterCallback,
    TplCommandInterpreter,
} from './core';

export class ZotonicVSCodeCommand {
    public async setup(context: ExtensionContext) {
        this.registerCommands(context);
    }

    get tplCommands(): ICommand {
        return {
            getUserChoice: (choices, next) => {
                return this.executeCommand('getUserChoice', choices, next);
            },

            insertSnippet: (snippet) => {
                return this.executeCommand('insertSnippet', snippet);
            },

            showUpSnippets: () => {
                return this.executeCommand('showUpSnippets');
            },

            growl: (msg) => {
                return this.executeCommand('growl', msg);
            },

            growlError: (msg) => {
                return this.executeCommand('growlError', msg);
            },

            get: (url) => {
                // TODO: Check type
                return this.executeCommand('get', url) as any;
            },
        };
    }

    get vscodeCommands(): RegisterTplCommand {
        return {
            executeCommand: this.commandCallback,
            getUserChoice: this.commandGetUserChoice,
            insertSnippet: this.commandInsertSnippet,
            showUpSnippets: this.commandShowUpSnippets,
            growl: this.commandGrowl,
            growlError: this.commandGrowlError,
            get: this.commandHttpGet,
        };
    }

    genCommandName<T extends TplCommandName>(
        commandName: T,
    ): VSCodeCommandName<T> {
        return `tpl.${commandName}`;
    }

    executeCommand<T extends TplCommandName>(
        tplCommandName: T,
        ...args: TplCommandArgs<T>
    ) {
        const vscodeCommandName = this.genCommandName(tplCommandName);
        return commands.executeCommand(
            vscodeCommandName,
            ...args,
        ) as TplCommandReturn<T>;
    }

    registerCommand<T extends TplCommandName>(
        context: ExtensionContext,
        tplCommandName: T,
        callback: TplCommandFunction<T>,
    ) {
        const vscodeCommandName = this.genCommandName(tplCommandName);
        const command = commands.registerCommand(vscodeCommandName, callback);
        context.subscriptions.push(command);
        return this;
    }

    registerTextEditorCommand<T extends TplCommandName>(
        context: ExtensionContext,
        tplCommandName: T,
        callback: TextEditorCommandCallback<TplCommandArgs<T>>,
    ) {
        const vscodeCommandName = this.genCommandName(tplCommandName);
        const command = commands.registerTextEditorCommand(
            vscodeCommandName,
            callback as TextEditorCommandCallback,
        );
        context.subscriptions.push(command);
        return this;
    }

    // TODO: Review the 'interpreter' word
    genCommandInterpreter<
        Name extends TplCommandName,
        Kind extends CommandKind,
    >(
        tplCommandName: Name,
        kind: Kind,
        callback: CommandInterpreterCallback<Name, Kind>,
    ): TplCommandInterpreter<Name, Kind> {
        return {
            tplCommandName,
            kind,
            callback,
        };
    }

    get commandInsertSnippet() {
        return this.genCommandInterpreter(
            'insertSnippet',
            'textEditorCommand',
            async (editor, _edit, snippet) => {
                editor.insertSnippet(new SnippetString(snippet));
            },
        );
    }

    get commandGetUserChoice() {
        return this.genCommandInterpreter(
            'getUserChoice',
            'command',
            async (choices, next) => {
                const quickPick = window.createQuickPick();
                quickPick.items = choices.map((choice) => ({
                    label: choice,
                }));
                quickPick.onDidChangeSelection(async ([{ label }]) => {
                    const i = choices.indexOf(label);
                    const choice = choices[i];
                    await next(choice);
                    quickPick.hide();
                });
                quickPick.show();
            },
        );
    }

    get commandShowUpSnippets() {
        return this.genCommandInterpreter('showUpSnippets', 'command', () =>
            commands.executeCommand('editor.action.triggerSuggest'),
        );
    }

    get commandGrowl() {
        return this.genCommandInterpreter('growl', 'command', async (msg) => {
            await window.showInformationMessage(msg);
        });
    }

    get commandGrowlError() {
        return this.genCommandInterpreter(
            'growlError',
            'command',
            async (msg) => {
                await window.showErrorMessage(msg);
            },
        );
    }

    get commandHttpGet() {
        return this.genCommandInterpreter('get', 'command', async (url) => {
            const response = await axios.get(url);
            return response.status === 200 ? response.data : undefined;
        });
    }

    get commandCallback() {
        return this.genCommandInterpreter(
            'executeCommand',
            'command',
            (callback: ISnippetCommandCallback) => callback(this.tplCommands),
        );
    }

    public registerCommands(context: ExtensionContext) {
        for (const { kind, tplCommandName, callback } of Object.values(
            this.vscodeCommands,
        )) {
            switch (kind) {
                case 'command':
                    this.registerCommand(context, tplCommandName, callback);
                    continue;
                case 'textEditorCommand':
                    this.registerTextEditorCommand(
                        context,
                        tplCommandName,
                        callback as TextEditorCommandCallback,
                    );
                    continue;
                default:
                    throw new Error('Command kind not implemented.');
            }
        }
        return this;
    }
}
