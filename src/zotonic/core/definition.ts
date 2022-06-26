// TODO: Move selector to a common file
import { Selector } from './snippet';

export interface IDefinitionProvider {
    selector: Selector;
    // TODO: Rename to regex
    pattern: RegExp;
    extensions: string[];
    locations: string[];
    ignoreLocations?: string[];
}
