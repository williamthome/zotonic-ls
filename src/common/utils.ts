export function minZero(value: number) {
    return value < 0 ? 0 : value;
}

export function joinWithBreakLine(toJoin: string | [string, ...string[]]) {
    return Array.isArray(toJoin) ? toJoin.join('\n') : toJoin;
}

export function formatToGlobPattern<T extends string | Array<unknown>>(
    value: T,
) {
    if (Array.isArray(value)) {
        return value.length > 1 ? `{${value.join(',')}}` : value[0];
    }
    return value;
}

export function getFileNameFromPath(path: string) {
    const parts = path.split(/\/|\\/);
    const lastPart = parts[parts.length - 1].split('.');
    return lastPart[0];
}
