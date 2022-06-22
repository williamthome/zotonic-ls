import { FileSnippetProvider } from '../../file-provider';

export class TagTemplateSnippetProvider extends FileSnippetProvider {
    constructor() {
        super({
            extensions: ['tpl'],
            workspaces: [['priv', 'templates']],
            pattern: /(?<={%\s*(extends|(all\s*)?((cat)?include))\s*").*?(?=")/,
            filenameRegExp(rootsEscaped: string) {
                return new RegExp(`(?<=\\/(${rootsEscaped})\\/).*`);
            },
            transformSnippet(snippet) {
                snippet.description =
                    "A .tpl file located at '<apps|apps_user>/<module>/priv/templates'.";
                snippet.documentation = `
                        <h1>Templates</h1>
                        <p>Templates are text files marked up using the Zotonic template language. Zotonic interprets that mark-up to dynamically generate HTML pages. Zotonic’s template syntax is very similar to the Django Template Language (DTL).</p>
                        <br>
                        <a href="https://zotonic.com/en/latest/developer-guide/templates.html">@docs/developer-guide</a>
                        <br>
                        <a href="https://zotonic.com/search?qs=templates">@docs/search</a>
                `;
                return snippet;
            },
        });
    }
}
