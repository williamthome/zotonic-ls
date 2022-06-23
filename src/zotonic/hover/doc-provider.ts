import { ICommand } from '../core';
import { HoverProvider } from './provider';

interface ConstructorArgs {
    pattern: RegExp;
}

export class DocHoverProvider extends HoverProvider {
    constructor({ pattern }: ConstructorArgs) {
        super({ pattern });
    }

    public async content(
        match: string,
        commands: ICommand,
    ): Promise<string | undefined> {
        const url = `https://google.com/search?q=${match}`;
        const response = await commands.get<string>(url);

        const result = response instanceof Error ? undefined : response;
        console.log(result);

        return match;
    }
}
