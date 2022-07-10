import { immutable } from '@/common/functional-programming';

export type HttpMethod = 'POST' | 'GET' | 'PUT' | 'PATCH' | 'DELETE';

export interface HttpRequestOptions {
    method: HttpMethod;
}

export function buildHttpRequestArgs(args: {
    url: string;
    options?: HttpRequestOptions;
}) {
    return immutable({
        url: args.url,
        options: {
            method: args.options?.method ?? ('GET' as HttpMethod),
        },
    });
}

export type HttpRequestArgs = ReturnType<typeof buildHttpRequestArgs>;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type HttpRequest<T = any> = (
    args: Required<HttpRequestArgs>,
) => Promise<T | Error>;

export type HttpRequestReturn<T> = ReturnType<HttpRequest<T>>;
