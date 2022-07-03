import { expectEqual, expectThrowException } from './expect';
import { buildSpy } from './spy';

describe('utils/spy', () => {
    function makeSut() {
        const fn = (args: { foo: 'bar' }) => args.foo;

        const sut = buildSpy(fn);

        return {
            sut,
            fn,
        };
    }

    it('should be called with right args', () => {
        const { sut } = makeSut();

        sut.spy({ foo: 'bar' });

        expectEqual(sut.args, { foo: 'bar' });
    });

    it('should be called once', () => {
        const { sut } = makeSut();

        sut.spy({ foo: 'bar' });

        expectEqual(sut.calledOnce, true);
    });

    it('should be called two times', () => {
        const { sut } = makeSut();

        sut.spy({ foo: 'bar' });
        sut.spy({ foo: 'bar' });

        expectEqual(sut.calledTimes, 2);
    });

    it('should throw if throws', () => {
        const { sut, fn } = makeSut();

        sut.throwException = true;

        expectThrowException(fn);
    });

    it('should return the expected value', () => {
        const { sut, fn } = makeSut();

        sut.spy({ foo: 'bar' });

        expectEqual(sut.value, fn({ foo: 'bar' }));
    });
});
