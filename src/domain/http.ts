import { Any } from '../common/types';
import { zObj } from './z-obj';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions {
    method: HttpMethod;
}

export function buildHttpRequestArgs(args: {
    url: string;
    options?: HttpRequestOptions;
}) {
    return zObj('httpRequest', {
        url: args.url,
        options: {
            method: args.options?.method ?? ('GET' as HttpMethod),
        },
    });
}

export type HttpRequestArgs = ReturnType<typeof buildHttpRequestArgs>;

export type HttpRequest<T = Any> = (
    args: Required<HttpRequestArgs>,
) => Promise<T | Error>;

export type HttpRequestReturn<T> = ReturnType<HttpRequest<T>>;
