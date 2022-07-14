import { immutable } from '@/common/functional-programming';
import { Args } from '@/common/types';

export type PopUpFormat = 'plaintext' | 'html';

export function buildPopUp(
    args:
        | string
        | {
              text: string;
              format: PopUpFormat;
          },
) {
    return immutable(
        typeof args === 'string'
            ? {
                  text: args,
                  format: 'plaintext' as PopUpFormat,
              }
            : args,
    );
}

export type PopUpArgs = Args<typeof buildPopUp>;
export type PopUp = ReturnType<typeof buildPopUp>;
