import { ExtensionContext, TextEditor } from 'vscode';
import { Z } from '@/domain/z';
import { FilesByGlobPattern } from '@/domain/files';
import { registerSnippetProvider } from './completion-item-provider';
import { registerHoverProvider } from './hover-provider';
import { registerDefinitionProvider } from './definition-provider';
import { registerCommand } from './command';
import { buildCommands } from './commands';

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

            buildCommands({ editor }).forEach(registerCommand({ context }));
        },
    };
}
