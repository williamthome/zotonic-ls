import { ExtensionContext, TextEditor } from 'vscode';
import { Z } from '@/domain/z';
import { FilesByGlobPattern } from '@/domain/files';
import { registerSnippetProvider } from './completion-item-provider';
import { registerHoverProvider } from './hover-provider';
import { registerDefinitionProvider } from './definition-provider';
import {
    buildGetUserChoiceCommand,
    buildInsertSnippetCommand,
    buildMainCommand,
    buildPopUpSnippets,
} from './commands';
import { registerCommand } from './command';

export function buildZVSCode(args: {
    z: Z;
    context: ExtensionContext;
    filesByGlobPattern: FilesByGlobPattern;
    editor: TextEditor;
}) {
    const { z, context, filesByGlobPattern, editor } = args;

    return {
        setup() {
            z.snippetProviders.forEach(
                registerSnippetProvider({
                    selector: z.selector,
                    context,
                }),
            );

            z.hoverProviders.forEach(
                registerHoverProvider({
                    selector: z.selector,
                    context,
                }),
            );

            z.definitionProviders.forEach(
                registerDefinitionProvider({
                    selector: z.selector,
                    context,
                    filesByGlobPattern,
                }),
            );

            const generalCommands = [
                buildGetUserChoiceCommand(),
                buildInsertSnippetCommand({ editor }),
                buildPopUpSnippets(),
            ];
            const coreCommands = [
                buildMainCommand({ commands: generalCommands }),
            ];
            const commands = [...generalCommands, ...coreCommands];

            commands.forEach(registerCommand({ context }));
        },
    };
}
