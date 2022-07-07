import { buildFile, FilesByGlobPattern } from '../../domain/files';
import { workspace } from 'vscode';

export function buildFilesByGlobPattern(): FilesByGlobPattern {
    return async function (args) {
        console.log('files by glob pattern');

        const files = await workspace.findFiles(
            args.globPattern,
            args.ignoreGlobPattern,
        );
        return files.map((f) =>
            buildFile({
                name: f.fsPath, // TODO: get file name
                path: f.fsPath,
            }),
        );
    };
}
