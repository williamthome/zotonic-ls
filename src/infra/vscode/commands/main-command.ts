import { immutable } from '../../../common/functional-programming';
import { AnyPromiseable } from '../../../common/types';
import { Command } from '../../../domain/commands';

export function buildMainCommand(args: { commands: Array<AnyPromiseable> }) {
    const commands = immutable(
        args.commands.reduce((acc, command) => {
            Object.defineProperty(acc, command.name, {
                value: command,
            });
            return acc;
        }, new Object()),
    );

    return async function zotonicCommand(command: Command) {
        await command(commands);
    };
}

export const mainCommandName = 'zotonicCommand';
