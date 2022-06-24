import { DocHoverProvider } from '../doc-provider';

interface ConstructorArgs {
    host: string;
}

export class TranslationHoverProvider extends DocHoverProvider {
    public host: string;

    constructor({ host }: ConstructorArgs) {
        super({
            pattern: /(?=\{_\s).*?(?:\s_\})/,
            genUrl: () => `${host}/developer-guide/translation.rst`,
        });

        this.host = host;
    }
}
