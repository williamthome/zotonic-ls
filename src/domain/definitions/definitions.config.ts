import { DefinitionProvider } from './definition-provider';
import {
    buildImageDefinitionProvider,
    buildJsDefinitionProvider,
    buildModelDefinitionProvider,
    buildStyleDefinitionProvider,
    buildTplDefinitionProvider,
} from './providers';

export function buildDefinitionProviders() {
    const definitionProviders: DefinitionProvider[] = [
        buildTplDefinitionProvider(),
        buildJsDefinitionProvider(),
        buildStyleDefinitionProvider(),
        buildImageDefinitionProvider(),
        buildModelDefinitionProvider(),
    ];

    return definitionProviders;
}
