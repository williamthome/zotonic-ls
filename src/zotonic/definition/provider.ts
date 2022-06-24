import { IDefinitionProvider, Selector } from '../core';

export interface ConstructorArgs {
    selector?: Selector;
    pattern: RegExp;
    extensions: string[];
    locations: string[];
    ignoreLocations?: string[];
}

export abstract class DefinitionProvider implements IDefinitionProvider {
    public selector: Selector;
    public pattern: RegExp;
    public extensions: string[];
    public locations: string[];
    public ignoreLocations?: string[];

    constructor({
        selector,
        pattern,
        extensions,
        locations,
        ignoreLocations,
    }: ConstructorArgs) {
        this.selector = selector || 'tpl';
        this.pattern = pattern;
        this.extensions = extensions;
        this.locations = locations;
        this.ignoreLocations = ignoreLocations;
    }
}
