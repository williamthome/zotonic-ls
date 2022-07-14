import { GrowlErrorCommand } from '@/domain/commands';
import { window } from 'vscode';

export function buildGrowlErrorCommand(): GrowlErrorCommand {
    return async function growlError(args: { error: string | Error }) {
        const { error } = args;

        const msg = error instanceof Error ? error.message : error;

        return window.showErrorMessage(msg).then();
    };
}
