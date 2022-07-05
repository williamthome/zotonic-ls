import { FilesByWorkspace } from '@/domain/file';
import { buildSnippetProviderFromFiles } from '../../snippet-provider-from-files';

export function buildImageTagSnippetProvider(args: {
    filesByWorkspace: FilesByWorkspace;
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
        filesByWorkspace: args.filesByWorkspace,
    });
}
