import { expectEqual, expectNotEqual, expectThrowException } from './expect';
import { buildSpy, SpyOptionsArgs } from './spy';

describe('utils/spy', () => {
    function makeSut(options?: SpyOptionsArgs) {
        const fn = (args: { foo: 'bar' }) => args.foo;

        const sut = buildSpy(fn, options);

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
        const { fn } = makeSut({ throwException: true });

        expectThrowException(fn);
    });

    it('should return the expected value', () => {
        const { sut, fn } = makeSut();

        sut.spy({ foo: 'bar' });

        expectEqual(sut.value, fn({ foo: 'bar' }));
    });

    it('should set options', () => {
        const { sut } = makeSut({ throwException: true });

        const oldOptions = sut.options;
        sut.options = { throwException: false };

        expectNotEqual(oldOptions, sut.options);

        sut.options.throwException = true;
        expectEqual(oldOptions, sut.options);
    });
});
