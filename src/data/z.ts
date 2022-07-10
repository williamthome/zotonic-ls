import { FilesByGlobPattern } from '@/domain/files';
import {
    HoverProvider,
    buildActionHoverProvider,
    buildBuiltInTagHoverProvider,
    buildFilterHoverProvider,
} from '@/domain/hover';
import { HttpRequest } from '@/domain/http';
import {
    buildImageTagSnippetProvider,
    buildModelSnippetProvider,
    buildMSnippetProvider,
    buildTemplateTagSnippetProvider,
    SnippetProvider,
} from '@/domain/snippets';

export function buildZ(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
    host: string;
    httpRequest: HttpRequest;
}) {
    const _snippetProviders: SnippetProvider[] = [buildMSnippetProvider()];

    const _snippetProvidersFromFiles = [
        buildModelSnippetProvider,
        buildImageTagSnippetProvider,
        buildTemplateTagSnippetProvider,
    ];

    _snippetProvidersFromFiles.forEach((snippetProvider) => {
        _snippetProviders.push(
            snippetProvider({
                filesByGlobPattern: args.filesByGlobPattern,
                workspacesRoot: args.workspacesRoot,
            }),
        );
    });

    const _hoverProviders: HoverProvider[] = [];

    const _documentationHoverProvider = [
        buildActionHoverProvider,
        buildBuiltInTagHoverProvider,
        buildFilterHoverProvider,
    ];

    _documentationHoverProvider.forEach((hoverProvider) => {
        _hoverProviders.push(
            hoverProvider({
                host: args.host,
                httpGet: args.httpRequest,
            }),
        );
    });

    return {
        get selector() {
            return 'tpl';
        },
        get snippetProviders() {
            return _snippetProviders;
        },
        get hoverProviders() {
            return _hoverProviders;
        },
    };
}

export type Z = ReturnType<typeof buildZ>;
