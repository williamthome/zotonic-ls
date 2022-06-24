import { DocHoverProvider } from '../doc-provider';

interface ConstructorArgs {
    host: string;
}

export class TagHoverProvider extends DocHoverProvider {
    public host: string;

    constructor({ host }: ConstructorArgs) {
        super({
            pattern:
                /(?<={%\s*)(all\s+catinclude|all\s+include|autoescape|block|cache|call|catinclude|comment|cycle|extends|filter|firstof|for|if|if d|ifchanged|ifequal|ifnotequal|image|image_data_url|image_url|include|inherit|javascript|javascript|lib|load|media|now|overrules|print|raw|regroup|spaceless|templatetag|trans|trans_ext|url|with)/,
            genUrl: (tag) => {
                const escaped = this.escape(tag);
                return `${host}/ref/tags/tag_${escaped}.rst`;
            },
        });

        this.host = host;
    }

    private escape(tag: string) {
        return tag.replace(/\s+/g, '-');
    }
}
