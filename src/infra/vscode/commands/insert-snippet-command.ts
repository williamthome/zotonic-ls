import { InsertSnippetCommand } from '@/domain/commands';
import { SnippetString, TextEditor } from 'vscode';

export function buildInsertSnippetCommand(args: {
    editor: TextEditor;
}): InsertSnippetCommand {
    return async function insertSnippet({ snippet }) {
        await args.editor.insertSnippet(new SnippetString(snippet));
    };
}
