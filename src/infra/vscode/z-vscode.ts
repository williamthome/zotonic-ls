import { Z } from '../../data';
import { ExtensionContext } from 'vscode';
import { registerSnippetProvider } from './completion-item-provider';

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
