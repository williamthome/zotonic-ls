import { DefinitionProvider } from './definition-provider';
import {
    buildLibDefinitionProvider,
    buildTplDefinitionProvider,
} from './providers';

export function buildDefinitionProviders() {
    const definitionProviders: DefinitionProvider[] = [
        buildTplDefinitionProvider(),
        buildLibDefinitionProvider(),
    ];

    return definitionProviders;
}
