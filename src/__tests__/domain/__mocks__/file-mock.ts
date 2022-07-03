import { buildFile } from '@/domain/file';

export function fileMock() {
    // TODO: Generate fake random values
    return buildFile({
        path: 'foo/bar.baz',
        name: 'bar.baz',
    });
}
