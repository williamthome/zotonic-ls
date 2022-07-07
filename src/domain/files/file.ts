export function buildFile(args: { name: string; path: string }) {
    return {
        name: args.name,
        path: args.path,
    };
}

export type File = ReturnType<typeof buildFile>;
