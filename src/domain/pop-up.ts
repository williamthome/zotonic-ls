import { Args } from '../common/types';
import { ZObj, zObj } from './z-obj';

export type PopUpFormat = 'plaintext' | 'html';

export function buildPopUp(
    args:
        | string
        | {
              text: string;
              format: PopUpFormat;
          },
) {
    return zObj(
        'popUp',
        typeof args === 'string'
            ? {
                  text: args,
                  format: 'plaintext' as PopUpFormat,
              }
            : args,
    );
}

export type PopUpArgs = Args<typeof buildPopUp>;
export type PopUp = ZObj<typeof buildPopUp>;
