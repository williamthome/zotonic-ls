import {
    ExtensionContext,
    Hover,
    HoverProvider,
    languages,
    MarkdownString,
} from 'vscode';
import {
    Zotonic,
    IHoverProvider,
    HoverProvider as ZHoverProvider,
    ICommand,
} from '../zotonic';

export class ZotonicVSCodeHover {
    public async setup(
        zotonic: Zotonic,
        commands: ICommand,
        context: ExtensionContext,
    ) {
        this.registerProviders(zotonic, commands, context);
    }

    public registerProvider(context: ExtensionContext, commands: ICommand) {
        return (provider: IHoverProvider) => {
            if (provider instanceof ZHoverProvider) {
                context.subscriptions.push(
                    languages.registerHoverProvider(
                        provider.selector,
                        this.parseProvider(provider, commands),
                    ),
                );
            } else {
                throw new Error('Provider not implemented.');
            }
        };
    }

    public registerProviders(
        zotonic: Zotonic,
        commands: ICommand,
        context: ExtensionContext,
    ) {
        zotonic.hovers.forEach(this.registerProvider(context, commands));
        return this;
    }

    public parseProvider(
        provider: IHoverProvider,
        commands: ICommand,
    ): HoverProvider {
        return {
            provideHover: async (document, position) => {
                const range = document.getWordRangeAtPosition(
                    position,
                    provider.pattern,
                );
                if (range) {
                    const text = document.getText(range);
                    const found = await provider.content(text, commands);
                    if (!found) {
                        return undefined;
                    }

                    const markdown = new MarkdownString(found);
                    markdown.supportHtml = true;
                    markdown.isTrusted = true;
                    markdown.supportThemeIcons = true;

                    return new Hover(markdown);
                }
            },
        };
    }
}
