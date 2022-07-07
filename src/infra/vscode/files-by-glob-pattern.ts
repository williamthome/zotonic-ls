import { workspace } from 'vscode';
import { buildFile, FilesByGlobPattern } from '../../domain/files';
import { getFileNameFromPath } from '../../common/utils';

export function buildFilesByGlobPattern(): FilesByGlobPattern {
    return async function (args) {
        console.log('files by glob pattern');

        const files = await workspace.findFiles(
            args.globPattern,
            args.ignoreGlobPattern,
        );
        return files.map((f) =>
            buildFile({
                name: getFileNameFromPath(f.path),
                path: f.fsPath,
            }),
        );
    };
}
