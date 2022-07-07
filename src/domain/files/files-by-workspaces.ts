import { formatToGlobPattern } from '../../common/utils';
import { buildFile, File } from './file';
import { FilenameRegexByWorkspace, FilesByGlobPattern } from './protocol';

export function buildFilesByWorkspaces(args: {
    cwd?: string;
    workspacesRoot: [string, ...string[]];
    workspaces: string[][];
    extensions: string[];
    allowDuplicates?: boolean;
    filesByGlobPattern: FilesByGlobPattern;
    filenameRegexByWorkspace: FilenameRegexByWorkspace;
}) {
    const root = formatToGlobPattern(args.workspacesRoot);
    const path = formatToGlobPattern(args.workspaces.map((r) => r.join('/')));
    const ext = formatToGlobPattern(args.extensions);
    const globPattern = `${root}/**/${path}/**/*.${ext}`;
    const escapedWorkspaces = args.workspaces
        .map((r) => r.join('\\/'))
        .join('|');

    return async function () {
        const files = await args.filesByGlobPattern({ globPattern });

        return files.reduce((arr, { path: filePath }) => {
            const filePathMatch = args
                .filenameRegexByWorkspace({ workspace: escapedWorkspaces })
                .exec(filePath);

            if (!filePathMatch || !filePathMatch.length) {
                return arr;
            }

            const fileName = filePathMatch[0];

            if (
                !args.allowDuplicates &&
                arr.some((file) => file.name === fileName)
            ) {
                return arr;
            }

            const file = buildFile({ name: fileName, path: filePath });

            arr.push(file);

            return arr;
        }, new Array<File>());
    };
}

export type FilesByWorkspaces = typeof buildFilesByWorkspaces;
