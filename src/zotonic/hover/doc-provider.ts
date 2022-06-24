import { ICommand } from '../core';
import { HoverProvider } from './provider';

type GenUrl = (match: string) => string | undefined;

interface ConstructorArgs {
    pattern: RegExp;
    genUrl: GenUrl;
}

export class DocHoverProvider extends HoverProvider {
    public genUrl: GenUrl;

    constructor({ pattern, genUrl: urlGen }: ConstructorArgs) {
        super({ pattern });

        this.genUrl = urlGen;
    }

    public async content(
        match: string,
        commands: ICommand,
    ): Promise<string | undefined> {
        const url = this.genUrl(match);
        const response = url ? await commands.get<string>(url) : undefined;

        return response instanceof Error ? undefined : response;
    }
}
