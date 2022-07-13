import { DefinitionProvider } from './definition-provider';
import { buildTplDefinitionProvider } from './providers';

export function buildDefinitionProviders() {
    const definitionProviders: DefinitionProvider[] = [
        buildTplDefinitionProvider(),
    ];

    return definitionProviders;
}
