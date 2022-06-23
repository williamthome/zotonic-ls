import { ICommand, IHoverProvider, Selector } from '../core';

interface ConstructorArgs {
    selector?: Selector;
    pattern: RegExp;
}

export abstract class HoverProvider implements IHoverProvider {
    public abstract content(
        match: string,
        commands: ICommand,
    ): Promise<string | undefined>;

    public selector: Selector;
    public pattern: RegExp;

    constructor({ selector, pattern }: ConstructorArgs) {
        this.selector = selector || 'tpl';
        this.pattern = pattern;
    }
}
