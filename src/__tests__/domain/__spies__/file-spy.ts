// TODO: Check unused functions

import {
    FilenameRegexByWorkspace,
    FilesByGlobPattern,
    // FilesByWorkspaces,
} from '@/domain/files';
import { buildSpy } from '@/__tests__/__utils__';
import { fileMock } from '@/__tests__/domain/__mocks__/';

// export function filesByWorkspaceSpy() {
//     return buildSpy<FilesByWorkspaces>(() => {
//         return Promise.resolve([fileMock()]);
//     });
// }

export function filesByGlobPatternSpy() {
    return buildSpy<FilesByGlobPattern>(() => {
        return Promise.resolve([fileMock()]);
    });
}

export function filenameRegexByWorkspaceSpy() {
    return buildSpy<FilenameRegexByWorkspace>(() => /bar.baz/);
}
