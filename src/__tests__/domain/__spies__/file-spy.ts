// TODO: Check unused functions

import {
    // FilenameRegexByWorkspace,
    // FilesByGlobPattern,
    FilesByWorkspace,
} from '@/domain/file';
import { buildSpy } from '@/__tests__/__utils__';
import { fileMock } from '../__mocks__/file-mock';

export function filesByWorkspaceSpy() {
    return buildSpy<FilesByWorkspace>(() => {
        return Promise.resolve([fileMock()]);
    });
}

// export function filesByGlobPatternSpy() {
//     return buildSpy<FilesByGlobPattern>(() => {
//         return Promise.resolve([fileMock()]);
//     });
// }

// export function filenameRegexByWorkspaceSpy() {
//     return buildSpy<FilenameRegexByWorkspace>(() => /bar.baz/);
// }
