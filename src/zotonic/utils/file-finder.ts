import {
    FindByPattern,
    FindInWorkspaceArgs,
    FindInWorkspaceReturn,
    IFileFinder,
} from '../core/file-finder';

interface ConstructorArgs {
    workspacesRootFallback: string | string[];
}

export abstract class FileFinder implements IFileFinder {
    public abstract findByPattern: FindByPattern;
    public workspacesRootFallback: string | string[];

    constructor({ workspacesRootFallback }: ConstructorArgs) {
        this.workspacesRootFallback = workspacesRootFallback;
    }

    public async findInWorkspace({
        maybeWorkspacesRoot,
        workspaces,
        extensions,
        fileNamePattern,
        allowDuplicates,
    }: FindInWorkspaceArgs): Promise<FindInWorkspaceReturn[]> {
        const workspacesRoot =
            maybeWorkspacesRoot || this.workspacesRootFallback;

        const root = this.maybeEmbrace(workspacesRoot);
        const path = this.maybeEmbrace(workspaces.map((r) => r.join('/')));
        const ext = this.maybeEmbrace(extensions);
        const pattern = `${root}/**/${path}/**/*.${ext}`;

        const files = await this.findByPattern({ pattern });
        return files.reduce((arr, filePath) => {
            const escapedWorkspaces = workspaces
                .map((r) => r.join('\\/'))
                .join('|');

            const filePathMatch =
                fileNamePattern(escapedWorkspaces).exec(filePath);

            if (!filePathMatch || !filePathMatch.length) {
                return arr;
            }

            const fileName = filePathMatch[0];

            if (
                !allowDuplicates &&
                arr.some((file) => file.fileName === fileName)
            ) {
                return arr;
            }

            arr.push({ fileName, filePath });
            return arr;
        }, new Array<FindInWorkspaceReturn>());
    }

    public maybeEmbrace<T, K>(arr: T, value?: K) {
        return Array.isArray(arr)
            ? arr.length > 1
                ? `{${value || arr.join(',')}}`
                : value || arr[0]
            : value || '';
    }
}
