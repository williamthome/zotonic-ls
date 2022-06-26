import { Position, TextDocument } from 'vscode';
import { ISnippetProvider, Selector } from '../../zotonic/core';

export type EmbeddedGetSnippetsArgs = [
    document: TextDocument,
    position: Position,
];

export type EmbeddedGetSnippetsReturn =
    | ISnippetProvider['getSnippets']
    | undefined;

export type EmbeddedGetSnippets = (
    ...args: EmbeddedGetSnippetsArgs
) => EmbeddedGetSnippetsReturn;

export interface IEmbeddedSnippetProvider {
    selector: Selector;
    pattern: RegExp;
    getSnippets: EmbeddedGetSnippets;
}
