import { AnyPromiseable } from '@/common/types';
import { GetUserChoiceCommand } from './get-user-choice-command';
import { GrowlErrorCommand } from './growl-error-command';
import { InsertSnippetCommand } from './insert-snippet-command';
import { PopUpSnippetsCommand } from './pop-up-snippets-command';

export type Command = AnyPromiseable;

export interface Commands {
    getUserChoice: GetUserChoiceCommand;
    insertSnippet: InsertSnippetCommand;
    popUpSnippets: PopUpSnippetsCommand;
    growlError: GrowlErrorCommand;
}

export type CommandCallback = (commands: Commands) => ReturnType<Command>;
