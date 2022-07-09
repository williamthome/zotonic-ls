import { ExtensionContext } from 'vscode';
import { Z } from '@/data';
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
