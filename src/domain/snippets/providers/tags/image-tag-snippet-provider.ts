import { FilesByGlobPattern } from '../../../files';
import { buildSnippetProviderFromFiles } from '../../snippet-provider-from-files';

export function buildImageTagSnippetProvider(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
}) {
    return buildSnippetProviderFromFiles({
        regex: /(?<={%\s*image(_data)?(_url)?\s*").*?(?=")/,
        workspaces: [
            ['priv', 'files', 'archive'],
            ['priv', 'lib', 'images'],
        ],
        extensions: [
            'apng',
            'gif',
            'ico',
            'cur',
            'jpg',
            'jpeg',
            'jfif',
            'pjpeg',
            'pjp',
            'png',
            'svg',
        ],
        filenameRegexByWorkspace({ workspace }) {
            return new RegExp(`(?<=\\/(${workspace})\\/).*`);
        },
        filesByGlobPattern: args.filesByGlobPattern,
        workspacesRoot: args.workspacesRoot,
    });
}
