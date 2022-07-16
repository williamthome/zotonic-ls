import { TextEditor } from 'vscode';

export type ActiveEditor = TextEditor | undefined;

export type GetActiveEditor = () => ActiveEditor;
