import { PopUpSnippetsCommand } from '@/domain/commands';
import { commands } from 'vscode';

export function buildPopUpSnippets(): PopUpSnippetsCommand {
    return async function popUpSnippets() {
        await commands.executeCommand('editor.action.triggerSuggest');
    };
}
