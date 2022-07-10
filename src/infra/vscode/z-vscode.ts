import { ExtensionContext } from 'vscode';
import { Z } from '@/domain/z';
import { registerSnippetProvider } from './completion-item-provider';
import { registerHoverProvider } from './hover-provider';

export function buildZVSCode(args: { z: Z; context: ExtensionContext }) {
    const { z, context } = args;
    return {
        setup() {
            z.snippetProviders.map(
                registerSnippetProvider({
                    selector: z.selector,
                    context,
                }),
            );

            z.hoverProviders.map(
                registerHoverProvider({
                    selector: z.selector,
                    context,
                }),
            );
        },
    };
}
