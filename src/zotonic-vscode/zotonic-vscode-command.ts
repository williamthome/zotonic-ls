import axios from 'axios';
import {
    ExtensionContext,
    SnippetString,
    commands,
    window,
    Range,
    Position,
} from 'vscode';
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
    get tplCommands(): ICommand {
        return {
            getUserChoice: (choices, next) => {
                return this.executeCommand('getUserChoice', choices, next);
            },

            currentPosition: () => {
                return this.executeCommand('currentPosition');
            },

            insertSnippet: (snippet) => {
                return this.executeCommand('insertSnippet', snippet);
            },

            showUpSnippets: () => {
                return this.executeCommand('showUpSnippets');
            },

            deleteText: (begin, end) => {
                return this.executeCommand('deleteText', begin, end);
            },

            growl: (msg) => {
                return this.executeCommand('growl', msg);
            },

            growlError: (msg) => {
                return this.executeCommand('growlError', msg);
            },

            get: (url) => {
                // TODO: Check type
                return this.executeCommand('get', url) as never;
            },
        };
    }

    get vscodeCommands(): RegisterTplCommand {
        return {
            executeCommand: this.commandCallback,
            getUserChoice: this.commandGetUserChoice,
            currentPosition: this.commandCurrentPosition,
            insertSnippet: this.commandInsertSnippet,
            showUpSnippets: this.commandShowUpSnippets,
            deleteText: this.commandDeleteText,
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

    get commandCurrentPosition() {
        return this.genCommandInterpreter('currentPosition', 'command', () => {
            const { line, character } = this.activeEditor().selection.active;

            return Promise.resolve({
                line,
                column: character,
            });
        });
    }

    get commandInsertSnippet() {
        return this.genCommandInterpreter(
            'insertSnippet',
            'command',
            async (snippet) => {
                await this.activeEditor().insertSnippet(
                    new SnippetString(snippet),
                );
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
        return this.genCommandInterpreter(
            'showUpSnippets',
            'command',
            async () => {
                await commands.executeCommand('editor.action.triggerSuggest');
            },
        );
    }

    get commandDeleteText() {
        return this.genCommandInterpreter(
            'deleteText',
            'command',
            async (begin, end) => {
                await this.activeEditor().edit((edit) => {
                    // TODO: Parse position.
                    edit.delete(
                        new Range(
                            new Position(begin.line, begin.column),
                            new Position(end.line, end.column),
                        ),
                    );
                });
            },
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

    private activeEditor() {
        const activeEditor = window.activeTextEditor;
        if (!activeEditor) {
            throw new Error('No active editor.');
        }
        return activeEditor;
    }
}
