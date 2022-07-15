import { DefinitionProvider } from './definition-provider';
import {
    buildJsDefinitionProvider,
    buildStyleDefinitionProvider,
    buildTplDefinitionProvider,
} from './providers';

export function buildDefinitionProviders() {
    const definitionProviders: DefinitionProvider[] = [
        buildTplDefinitionProvider(),
        buildJsDefinitionProvider(),
        buildStyleDefinitionProvider(),
    ];

    return definitionProviders;
}
