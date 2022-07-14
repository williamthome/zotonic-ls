import { AnyArray } from './types';

export function buildBag<T, TArgs extends AnyArray = []>(args: {
    fetchContent: (...args: TArgs) => Promise<T>;
}) {
    let _content: T | undefined = undefined;
    return {
        getContent: async function (...fetchArgs: TArgs) {
            if (!_content) {
                _content = await args.fetchContent(...fetchArgs);
            }
            return _content;
        },
        flush: function () {
            _content = undefined;
        },
    };
}
