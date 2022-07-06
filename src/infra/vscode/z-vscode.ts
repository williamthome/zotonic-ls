import { Z } from '../../data';
import { ExtensionContext } from 'vscode';
import { registerSnippetProvider } from './z-vscode-snippet-provider';

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
        },
    };
}
