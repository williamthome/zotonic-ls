import { transform } from '../../../common/functional-programming';
import { FilesByGlobPattern } from '../../files';
import { buildSnippetProviderFromFiles } from '../snippet-provider-from-files';

export function buildModelSnippetProvider(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
}) {
    return buildSnippetProviderFromFiles({
        regex: /(?<={%|{{|%{|\[).*?\bm\.(\w+)?/,
        workspaces: [['src', 'models']],
        extensions: ['erl'],
        filenameRegexByWorkspace() {
            return /(?<=\bm_).*?(?=.erl)/;
        },
        transformSnippet({ snippet }) {
            const transformedSnippet = transform(snippet, {
                description:
                    'A model located at "<apps|apps_user>/<module>/src/models".',
            });
            return transformedSnippet;
        },
        filesByGlobPattern: args.filesByGlobPattern,
        workspacesRoot: args.workspacesRoot,
    });
}
