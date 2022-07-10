export function minZero(value: number) {
    return value < 0 ? 0 : value;
}

export function joinWithBreakLine(toJoin: string | [string, ...string[]]) {
    return Array.isArray(toJoin) ? toJoin.join('\n') : toJoin;
}

export function formatToGlobPattern(value: string | Array<string>) {
    if (Array.isArray(value)) {
        return value.length > 1 ? `{${value.join(',')}}` : value[0];
    }
    return value;
}

export function filenameFrom(path: string) {
    const dirs = path.split(/\/|\\/);
    const basename = dirs[dirs.length - 1].split('.');
    return basename[0];
}
