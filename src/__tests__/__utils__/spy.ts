import { Args } from '@/domain/types';

function buildSpyOptions(args: { throwException?: boolean } = {}) {
    return {
        throwException: args.throwException ?? false,
    };
}

export type SpyOptionsArgs = Args<typeof buildSpyOptions>;
export type SpyOptions = ReturnType<typeof buildSpyOptions>;

export function buildSpy<T extends (args: any) => any>(
    mock: T,
    options?: SpyOptionsArgs,
) {
    let _options = buildSpyOptions(options);
    let _lastArgs: Args<T> | undefined = undefined;
    let _lastValue: ReturnType<T> | Error | undefined = undefined;
    let _calledTimes = 0;

    return {
        get options(): SpyOptions {
            return _options;
        },
        set options(options: SpyOptionsArgs) {
            _options = buildSpyOptions(options);
        },
        set throwException(throwException: boolean) {
            this.options.throwException = throwException;
        },
        get args() {
            return _lastArgs;
        },
        get value() {
            return _lastValue;
        },
        get calledTimes() {
            return _calledTimes;
        },
        get wasCalled() {
            return _calledTimes > 0;
        },
        get calledOnce() {
            return _calledTimes === 1;
        },
        spy(...args: Args<T> extends never ? [] : [Args<T>]): ReturnType<T> {
            _calledTimes++;
            _lastArgs = args.length ? args[0] : undefined;

            if (_options.throwException) {
                const error = new Error();
                _lastValue = error;
                throw error;
            }

            const value = mock(_lastArgs);
            _lastValue = value;
            return value;
        },
        reset() {
            _lastArgs = undefined;
            _lastValue = undefined;
            return this;
        },
    };
}
