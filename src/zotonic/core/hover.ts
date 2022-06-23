import { ICommand } from './command';

export type HoverContent = (
    match: string,
    commands: ICommand,
) => Promise<string | undefined>;

export interface IHoverProvider {
    pattern: RegExp;
    content: HoverContent;
}
