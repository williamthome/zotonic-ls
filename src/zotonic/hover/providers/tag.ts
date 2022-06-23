import { DocHoverProvider } from '../doc-provider';

export class TagHoverProvider extends DocHoverProvider {
    constructor() {
        super({
            pattern: /(?<={%\s*)(((all\s*)?(cat)?include)|\w+)/,
        });
    }
}
