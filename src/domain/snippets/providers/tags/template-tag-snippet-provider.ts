import { transform } from '../../../../common/functional-programming';
import { FilesByGlobPattern } from '../../../../domain/files';
import { buildPopUp } from '../../../../domain/pop-up';
import { buildSnippetProviderFromFiles } from '../../../../domain/snippets';

export function buildTemplateTagSnippetProvider(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
}) {
    return buildSnippetProviderFromFiles({
        regex: /(?<={%\s*(extends|(all\s*)?((cat)?include))\s*").*?(?=")/,
        workspaces: [['priv', 'templates']],
        extensions: ['tpl'],
        filenameRegexByWorkspace({ workspace }) {
            return new RegExp(`(?<=\\/(${workspace})\\/).*`);
        },
        transformSnippet({ snippet }) {
            return transform(snippet, {
                description:
                    "A .tpl file located at '<apps|apps_user>/<module>/priv/templates'.",
                documentation: buildPopUp({
                    format: 'html',
                    text: `
                        <h1>Templates</h1>
                        <p>Templates are text files marked up using the Zotonic template language. Zotonic interprets that mark-up to dynamically generate HTML pages. Zotonic’s template syntax is very similar to the Django Template Language (DTL).</p>
                        <br>
                        <a href="https://zotonic.com/en/latest/developer-guide/templates.html">@docs/developer-guide</a>
                        <br>
                        <a href="https://zotonic.com/search?qs=templates">@docs/search</a>
                    `,
                }),
            });
        },
        filesByGlobPattern: args.filesByGlobPattern,
        workspacesRoot: args.workspacesRoot,
    });
}
