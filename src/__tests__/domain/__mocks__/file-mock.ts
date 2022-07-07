import { buildFile } from '@/domain/files';

export function fileMock() {
    // TODO: Generate fake random values
    return buildFile({
        path: 'foo/bar.baz',
        name: 'bar.baz',
    });
}
