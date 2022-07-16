import { buildPopUp } from '@/domain/pop-up';
import { expectAny, expectZObj } from '@/__tests__/__utils__';

describe('domain/pop-up', () => {
    describe('buildPopUp', () => {
        it('should return with full props', () => {
            const sut = buildPopUp({
                text: 'foo',
                format: 'plaintext',
            });

            expectZObj(sut, {
                text: expectAny(String),
                format: expectAny(String),
            });
        });

        it('should return with full props if string args', () => {
            const sut = buildPopUp('foo');

            expectZObj(sut, {
                text: expectAny(String),
                format: expectAny(String),
            });
        });
    });
});
