import { DefinitionProvider } from './definition-provider';
import {
    buildImageDefinitionProvider,
    buildJsDefinitionProvider,
    buildStyleDefinitionProvider,
    buildTplDefinitionProvider,
} from './providers';

export function buildDefinitionProviders() {
    const definitionProviders: DefinitionProvider[] = [
        buildTplDefinitionProvider(),
        buildJsDefinitionProvider(),
        buildStyleDefinitionProvider(),
        buildImageDefinitionProvider(),
    ];

    return definitionProviders;
}
