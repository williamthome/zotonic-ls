import { InsertSnippetCommand } from '../../../domain/commands';
import { SnippetString } from 'vscode';
import { GetActiveEditor } from '../protocol';

export function buildInsertSnippetCommand(args: {
    activeEditor: GetActiveEditor;
}): InsertSnippetCommand {
    return async function insertSnippet({ snippet }) {
        const editor = args.activeEditor();
        if (!editor) {
            return;
        }

        await editor.insertSnippet(new SnippetString(snippet));
    };
}
