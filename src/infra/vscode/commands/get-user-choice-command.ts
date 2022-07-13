import {
    GetUserChoiceCommand,
    OnChoiceSelectedCommand,
} from '@/domain/commands';
import { window } from 'vscode';

export function buildGetUserChoiceCommand(): GetUserChoiceCommand {
    return async function getUserChoice(args: {
        choices: string[];
        onChoiceSelected: OnChoiceSelectedCommand;
    }) {
        const quickPick = window.createQuickPick();
        quickPick.items = args.choices.map((choice) => ({
            label: choice,
        }));
        quickPick.onDidChangeSelection(async ([{ label }]) => {
            const i = args.choices.indexOf(label);
            const choice = args.choices[i];
            await args.onChoiceSelected(choice);
            quickPick.hide();
        });
        quickPick.show();
    };
}
