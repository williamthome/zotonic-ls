import { immutable } from '@/common/functional-programming';
import { FilesByGlobPattern } from './files';
import { HttpRequest } from './http';
import { buildSnippetProviders } from './snippets';
import { buildHoverProviders } from './hover';
import { buildDefinitionProviders } from './definitions';

export function buildZ(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
    host: string;
    httpRequest: HttpRequest;
}) {
    const { filesByGlobPattern, workspacesRoot, host, httpRequest } = args;

    const _snippetProviders = buildSnippetProviders({
        filesByGlobPattern,
        workspacesRoot,
    });

    const _hoverProviders = buildHoverProviders({
        host,
        httpRequest,
    });

    const _definitionProviders = buildDefinitionProviders();

    return immutable({
        get selector() {
            return 'tpl';
        },
        get snippetProviders() {
            return _snippetProviders;
        },
        get hoverProviders() {
            return _hoverProviders;
        },
        get definitionProviders() {
            return _definitionProviders;
        },
    });
}

export type Z = ReturnType<typeof buildZ>;
