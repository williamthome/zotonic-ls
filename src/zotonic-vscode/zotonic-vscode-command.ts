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
        };
    }

    get vscodeCommands(): RegisterTplCommand {
        return {
            executeCommand: this.commandCallback,
            getUserChoice: this.commandGetUserChoice,
            insertSnippet: this.commandInsertSnippet,
            showUpSnippets: this.commandShowUpSnippets,
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
                    const choice = choices.find((choice) => choice === label);
                    if (!choice) {
                        // TODO: Include valid choices in the error message
                        throw new Error(
                            `Unexpected no choice match in quick pick with label "${label}"`,
                        );
                    }
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
