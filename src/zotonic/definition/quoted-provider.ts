import {
    DefinitionProvider,
    ConstructorArgs as DefintionConstructorArgs,
} from './provider';

type ConstructorArgs = Omit<DefintionConstructorArgs, 'pattern'>;

export abstract class QuotedDefinitionProvider extends DefinitionProvider {
    constructor(args: ConstructorArgs) {
        super({
            pattern: /(?<=").*?(?=")/,
            ...args,
        });
    }
}
