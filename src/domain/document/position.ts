import { immutable } from '../functional-programming';
import { minZero } from '../utils';

export function buildPosition(args: { line: number; column: number }) {
    return immutable({
        line: minZero(args.line),
        column: minZero(args.column),
    });
}

export type Position = ReturnType<typeof buildPosition>;
