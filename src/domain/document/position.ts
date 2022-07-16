import { minZero } from '../../common/utils';
import { ZObj, zObj } from '../z-obj';

export function buildPosition(args: { line: number; column: number }) {
    return zObj('position', {
        line: minZero(args.line),
        column: minZero(args.column),
    });
}

export type Position = ZObj<typeof buildPosition>;
