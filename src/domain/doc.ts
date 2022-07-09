import { immutable } from '@/common/functional-programming';
import { Args } from '@/common/types';

export type DocFormat = 'plaintext' | 'html';

export function buildDoc(
    args:
        | string
        | {
              text: string;
              format: DocFormat;
          },
) {
    return immutable(
        typeof args === 'string'
            ? {
                  text: args,
                  format: 'plaintext' as DocFormat,
              }
            : args,
    );
}

export type DocArgs = Args<typeof buildDoc>;
export type Doc = ReturnType<typeof buildDoc>;
