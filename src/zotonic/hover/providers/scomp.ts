import { DocHoverProvider } from '../doc-provider';

interface ConstructorArgs {
    host: string;
}

export class ScompHoverProvider extends DocHoverProvider {
    public host: string;

    constructor({ host }: ConstructorArgs) {
        super({
            pattern:
                /(?<={%\s*)(button|chart_pie|chart_pie3d|cotonic_pathname_search|debug|draggable|droppable|google_chart|inplace_textbox|lazy|live|loremipsum|mailinglist_subscribe|menu|pager|poll|script|sortable|sorter|spinner|tabs|validate|wire|wire_args|worker)/,
            genUrl: (scomp) => `${host}/ref/scomps/scomp_${scomp}.rst`,
        });

        this.host = host;
    }
}
