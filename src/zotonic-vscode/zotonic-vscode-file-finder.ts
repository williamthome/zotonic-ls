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

    // TODO: Check this function usecase and maybe remove it
    public async vscodeFindByPattern({
        pattern,
        ignorePattern,
    }: FindByPatternArgs): Promise<string[]> {
        const files = await workspace.findFiles(pattern, ignorePattern);
        return files.map((f) => f.fsPath);
    }

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
