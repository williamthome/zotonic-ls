import {
    HttpMethod,
    HttpRequest,
    HttpRequestArgs,
    HttpRequestReturn,
} from '@/domain/http';
import axios from 'axios';

export function buildHttpRequest<T>(): HttpRequest<T> {
    return function (args) {
        return axiosHttpRequest<T>(args);
    };
}

async function axiosHttpRequest<T>({
    url,
    options,
}: HttpRequestArgs): HttpRequestReturn<T> {
    const actionByMethod: {
        [Property in HttpMethod]: typeof axios[Lowercase<Property>];
    } = {
        /* eslint-disable @typescript-eslint/naming-convention */
        POST: axios.post,
        GET: axios.get,
        PUT: axios.put,
        PATCH: axios.patch,
        DELETE: axios.delete,
    };

    const response = await actionByMethod[options.method]<T>(url);
    return response.status === 200
        ? response.data
        : new Error(response.statusText);
}
