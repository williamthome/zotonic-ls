import { HoverProvider } from '@/domain/hover';
import {
    ExtensionContext,
    languages,
    HoverProvider as VSCodeHoverProvider,
    Hover,
} from 'vscode';
import { formatDoc } from './utils';

export function registerHoverProvider(args: {
    selector: string;
    context: ExtensionContext;
}) {
    return function (hoverProvider: HoverProvider) {
        args.context.subscriptions.push(
            languages.registerHoverProvider(
                args.selector,
                hoverProviderToVSCode(hoverProvider),
            ),
        );
    };
}

function hoverProviderToVSCode(
    hoverProvider: HoverProvider,
): VSCodeHoverProvider {
    return {
        async provideHover(document, position) {
            const range = document.getWordRangeAtPosition(
                position,
                hoverProvider.regex,
            );
            if (range) {
                const regexMatch = document.getText(range);

                const doc = await hoverProvider.getContent({
                    regexMatch,
                });
                if (!doc) {
                    return undefined;
                }

                const text = formatDoc(doc);

                return new Hover(text);
            }
        },
    };
}
