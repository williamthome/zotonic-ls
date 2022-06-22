import { glob } from 'glob';

export async function findFilesByPattern(
    baseDir: string,
    pattern: string,
    ignorePattern?: string,
): Promise<string[]> {
    return new Promise((resolve, reject) => {
        glob(
            pattern,
            {
                cwd: baseDir,
                ignore: ignorePattern,
                absolute: true,
            },
            (err, matches) => {
                err ? reject(err) : resolve(matches);
            },
        );
    });
}
