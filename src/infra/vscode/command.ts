import { AnyArray, AnyPromiseable } from '../../common/types';
import { Command } from '../../domain/commands';
import {
    commands as vscode,
    ExtensionContext,
    Command as VSCodeCommand,
} from 'vscode';
import { mainCommandName } from './commands';

export function registerCommand(args: { context: ExtensionContext }) {
    return function (command: AnyPromiseable) {
        if (!command.name) {
            throw new Error(
                'The command must not be anonymous to have a name. Build it like "function commandName() { }".',
            );
        }

        args.context.subscriptions.push(
            vscode.registerCommand(command.name, command),
        );
    };
}

export function executeCommand(command: { name: string; args: AnyArray }) {
    vscode.executeCommand(command.name, ...command.args);
}

export function zotonicCommandToVSCode(command: Command): VSCodeCommand {
    return {
        command: mainCommandName,
        title: 'Zotonic Command',
        arguments: [command],
    };
}
