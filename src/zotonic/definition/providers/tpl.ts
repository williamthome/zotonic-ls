import { QuotedDefinitionProvider } from '../quoted-provider';

interface ConstructorArgs {
    ignoreLocations?: string[];
}

export class TplDefinitionProvider extends QuotedDefinitionProvider {
    constructor({ ignoreLocations }: ConstructorArgs) {
        super({
            extensions: ['tpl'],
            locations: ['**/priv/templates/**/'],
            ignoreLocations,
        });
    }
}
