// TODO: Decouple from vscode and use the baseDir arg. Maybe use 'glob' lib.
import { workspace } from 'vscode';

export async function findFilesByPattern(
    _baseDir: string,
    pattern: string,
    ignorePattern?: string,
): Promise<string[]> {
    const files = await workspace.findFiles(pattern, ignorePattern);
    return files.map((f) => f.fsPath);
}
