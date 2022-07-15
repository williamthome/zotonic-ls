import { ZObj, zObj } from '../z-obj';

export function buildFile(args: { name: string; path: string }) {
    return zObj('file', {
        name: args.name,
        path: args.path,
    });
}

export type File = ZObj<typeof buildFile>;
