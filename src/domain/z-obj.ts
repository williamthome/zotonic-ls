import { immutable } from '../common/functional-programming';
import { AnyFunction, AnyObject } from '../common/types';

export function zObj<Kind, Defs extends AnyObject>(kind: Kind, defs: Defs) {
    return immutable({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        __kind__: kind,
        ...defs,
    });
}

export function isKindOf<Kind extends string>(kind: Kind, x: unknown) {
    return !!x && (x as ReturnType<typeof zObj>).__kind__ === kind;
}

export type ZObj<T extends AnyFunction> = ReturnType<T> extends ReturnType<
    typeof zObj
>
    ? ReturnType<T>
    : never;
