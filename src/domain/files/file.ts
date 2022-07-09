import { immutable } from '@/common/functional-programming';

export function buildFile(args: { name: string; path: string }) {
    return immutable({
        name: args.name,
        path: args.path,
    });
}

export type File = ReturnType<typeof buildFile>;
