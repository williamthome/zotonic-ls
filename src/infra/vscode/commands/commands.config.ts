import { GetActiveEditor } from '../protocol';
import { buildGetUserChoiceCommand } from './get-user-choice-command';
import { buildGrowlErrorCommand } from './growl-error-command';
import { buildInsertSnippetCommand } from './insert-snippet-command';
import { buildMainCommand } from './main-command';
import { buildPopUpSnippets } from './pop-up-snippets-command';

export function buildCommands(args: { activeEditor: GetActiveEditor }) {
    const { activeEditor } = args;

    const generalCommands = [
        buildGetUserChoiceCommand(),
        buildInsertSnippetCommand({ activeEditor }),
        buildPopUpSnippets(),
        buildGrowlErrorCommand(),
    ];

    const coreCommands = [buildMainCommand({ commands: generalCommands })];

    return [...generalCommands, ...coreCommands];
}
