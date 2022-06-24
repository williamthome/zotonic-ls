import {
    ExtensionContext,
    DefinitionProvider,
    languages,
    Position,
    Location,
    Uri,
} from 'vscode';
import {
    Zotonic,
    IDefinitionProvider,
    DefinitionProvider as ZDefinitionProvider,
    IFileFinder,
} from '../zotonic';

export class ZotonicVSCodeDefinition {
    public registerProvider(
        fileFinder: IFileFinder,
        context: ExtensionContext,
    ) {
        return (provider: IDefinitionProvider) => {
            if (provider instanceof ZDefinitionProvider) {
                context.subscriptions.push(
                    languages.registerDefinitionProvider(
                        provider.selector,
                        this.parseProvider(provider, fileFinder),
                    ),
                );
            } else {
                throw new Error('Provider not implemented.');
            }
        };
    }

    public registerProviders(
        zotonic: Zotonic,
        fileFinder: IFileFinder,
        context: ExtensionContext,
    ) {
        zotonic.definitions.forEach(this.registerProvider(fileFinder, context));
        return this;
    }

    public parseProvider(
        provider: IDefinitionProvider,
        fileFinder: IFileFinder,
    ): DefinitionProvider {
        return {
            provideDefinition: async (document, position) => {
                const range = document.getWordRangeAtPosition(
                    position,
                    provider.pattern,
                );
                if (!range) {
                    return;
                }

                const text = document.getText(range);
                const lastDotIndex = text.lastIndexOf('.');
                if (lastDotIndex <= 0) {
                    return;
                }

                const ext = text.substring(lastDotIndex + 1);
                if (!ext) {
                    return;
                }

                const lastSlashIndex = text.lastIndexOf('/');
                const fileName = text
                    .substring(lastSlashIndex)
                    .replace('/', '');
                if (!fileName) {
                    return;
                }

                const locationPattern = fileFinder.maybeEmbrace(
                    provider.locations,
                );
                const pattern = `${locationPattern}${fileName}`;
                const ignorePattern = fileFinder.maybeEmbrace(
                    provider.ignoreLocations,
                );

                const files = await fileFinder.findByPattern({
                    pattern,
                    ignorePattern,
                });
                if (!files) {
                    return;
                }

                return files.map((file) => {
                    const position = new Position(0, 0);
                    const uri = Uri.file(file);
                    return new Location(uri, position);
                });
            },
        };
    }
}
