import { DocHoverProvider } from '../doc-provider';

interface ConstructorArgs {
    host: string;
}

export class ValidatorHoverProvider extends DocHoverProvider {
    public host: string;

    constructor({ host }: ConstructorArgs) {
        super({
            pattern:
                /(?<=\{%\s*validate\s.*type=\{)(acceptance|confirmation|custom|date|email|email_unique|format|length|name_unique|numericality|postback|presence|username_unique)/s,
            genUrl: (validator) =>
                `${host}/ref/validators/validator_${validator}.rst`,
        });

        this.host = host;
    }
}
