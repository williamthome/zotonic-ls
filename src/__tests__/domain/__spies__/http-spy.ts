import { HttpRequest } from '@/domain/http';
import { buildSpy } from '@/__tests__/__utils__';

export function httpRequestSpy() {
    return buildSpy<HttpRequest>(() => {
        return Promise.resolve('foo');
    });
}
