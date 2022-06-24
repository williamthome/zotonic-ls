// TODO: Improve readability

/* eslint-disable @typescript-eslint/no-explicit-any */
import { TextEditor, TextEditorEdit } from 'vscode';
import { ICommand } from '../../zotonic/core';

export type TplCommandName = keyof ICommand | 'executeCommand';

export type VSCodeCommandName<T extends TplCommandName> = `tpl.${T}`;

export type TplCommandFunction<T extends TplCommandName> =
    T extends keyof ICommand
        ? ICommand[T] extends (...args: any[]) => any
            ? ICommand[T]
            : never
        : (...args: any[]) => any;

export type TplCommandArgs<T extends TplCommandName> = T extends keyof ICommand
    ? ICommand[T] extends (...args: infer Args) => any
        ? Args
        : never
    : any[];

export type TplCommandReturn<T extends TplCommandName> =
    T extends keyof ICommand
        ? ICommand[T] extends (...args: any[]) => infer Return
            ? Return
            : never
        : unknown;

export type CommandKind = 'command' | 'textEditorCommand';

export type CommandKindArgs<T extends CommandKind> = T extends 'command'
    ? []
    : T extends 'textEditorCommand'
    ? [TextEditor, TextEditorEdit]
    : never;

export type CommandInterpreterCallback<
    T extends TplCommandName,
    K extends CommandKind,
> = (
    ...args: [
        ...CommandKindArgs<K>,
        ...(TplCommandArgs<T> extends any[] ? TplCommandArgs<T> : any[]),
    ]
) => TplCommandReturn<T>;

export interface TplCommandInterpreter<
    T extends TplCommandName,
    K extends CommandKind = 'command',
> {
    tplCommandName: T;
    kind: K;
    callback: CommandInterpreterCallback<T, K>;
}

export type RegisterTplCommand = {
    [T in TplCommandName]: TplCommandInterpreter<T, any>;
};

export type TextEditorCommandCallback<T extends any[] = any[]> = (
    textEditor: TextEditor,
    edit: TextEditorEdit,
    ...args: T
) => void;

export type GenCommandName = <T extends TplCommandName>(
    commandName: T,
) => VSCodeCommandName<T>;
