import { DefinitionProvider } from '@/domain/definitions';
import { FilesByGlobPattern } from '@/domain/files';
import path from 'path';
import {
    ExtensionContext,
    languages,
    DefinitionProvider as VSCodeDefinitionProvider,
    Position,
    Location,
    Uri,
} from 'vscode';

export function registerDefinitionProvider(args: {
    selector: string;
    context: ExtensionContext;
    filesByGlobPattern: FilesByGlobPattern;
}) {
    return function (definitionProvider: DefinitionProvider) {
        return languages.registerDefinitionProvider(
            args.selector,
            definitionProviderToVSCode(
                definitionProvider,
                args.filesByGlobPattern,
            ),
        );
    };
}

function definitionProviderToVSCode(
    definitionProvider: DefinitionProvider,
    filesByGlobPattern: FilesByGlobPattern,
): VSCodeDefinitionProvider {
    return {
        async provideDefinition(document, position) {
            const range = document.getWordRangeAtPosition(
                position,
                definitionProvider.regex,
            );
            if (!range) {
                return;
            }

            const baseName = path.basename(document.getText(range));
            const fileName = definitionProvider.transformMatch
                ? definitionProvider.transformMatch(baseName)
                : baseName;

            const fileGlobPattern = `${definitionProvider.locationPattern}${fileName}`;

            const files = await filesByGlobPattern({
                globPattern: fileGlobPattern,
                ignoreGlobPattern: definitionProvider.locationPatternToIgnore,
            });
            if (!files) {
                return;
            }

            return files.map((file) => {
                const position = new Position(0, 0);
                const uri = Uri.file(file.path);
                return new Location(uri, position);
            });
        },
    };
}
