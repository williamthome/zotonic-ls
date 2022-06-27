import { glob } from 'glob';
import { window, workspace } from 'vscode';
import { FindByPatternArgs } from '../zotonic/core';
import { FileFinder } from '../zotonic/utils/file-finder';

export class ZotonicVSCodeFileFinder extends FileFinder {
    constructor() {
        super({
            workspacesRootFallback: ['apps', 'apps_user'],
        });
    }

    public findByPattern = ({
        pattern,
        ignorePattern,
    }: FindByPatternArgs): Promise<string[]> => {
        return this.vscodeFindByPattern({ pattern, ignorePattern });
    };

    public async vscodeFindByPattern({
        pattern,
        ignorePattern,
    }: FindByPatternArgs): Promise<string[]> {
        const files = await workspace.findFiles(pattern, ignorePattern);
        return files.map((f) => f.fsPath);
    }

    // TODO: Maybe remove this function.
    //       Changed to vscodeFindByPattern due to perfomance reason.
    public globFindByPattern = ({
        cwd,
        pattern,
        ignorePattern,
    }: FindByPatternArgs): Promise<string[]> => {
        return new Promise((resolve, reject) => {
            glob(
                pattern,
                {
                    cwd: cwd || this.getDocumentWorkspaceFolder() || __dirname,
                    ignore: ignorePattern,
                    absolute: true,
                },
                (err, matches) => {
                    err ? reject(err) : resolve(matches);
                },
            );
        });
    };

    private getDocumentWorkspaceFolder(): string | undefined {
        if (!window.activeTextEditor || !workspace.workspaceFolders) {
            return undefined;
        }

        const fileName = window.activeTextEditor.document.fileName;
        return workspace.workspaceFolders
            .map((folder) => folder.uri.fsPath)
            .filter((fsPath) => fileName.startsWith(fsPath))[0];
    }
}
