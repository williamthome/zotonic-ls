// TODO: Move selector to a common file
import { Selector } from './snippet';

export interface IDefinitionProvider {
    selector: Selector;
    pattern: RegExp;
    extensions: string[];
    locations: string[];
    ignoreLocations?: string[];
}
