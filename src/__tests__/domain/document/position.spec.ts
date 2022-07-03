import { buildPosition } from '@/domain/document/position';
import { expectEqual } from '@/__tests__/__utils__';

describe('domain/document/position', () => {
    describe('buildPosition', () => {
        it('should return a position with full props', () => {
            const position = buildPosition({
                line: 0,
                column: 0,
            });
            expectEqual(position, {
                line: expect.any(Number),
                column: expect.any(Number),
            });
        });
    });
});
