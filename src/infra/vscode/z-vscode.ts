import { ExtensionContext } from 'vscode';
import { Z } from '@/domain/z';
import { registerSnippetProvider } from './completion-item-provider';
import { registerHoverProvider } from './hover-provider';
import { registerDefinitionProvider } from './definition-provider';
import { FilesByGlobPattern } from '@/domain/files';

export function buildZVSCode(args: {
    z: Z;
    context: ExtensionContext;
    filesByGlobPattern: FilesByGlobPattern;
}) {
    const { z, context, filesByGlobPattern } = args;
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
        },
    };
}
