import { FilesByGlobPattern } from '@/domain/files';
import {
    HoverProvider,
    buildActionHoverProvider,
    buildBuiltInTagHoverProvider,
    buildFilterHoverProvider,
    buildModelHoverProvider,
    buildModuleTagHoverProvider,
    buildTranslationHoverProvider,
    buildValidatorHoverProvider,
} from '@/domain/hover';
import { HttpRequest } from '@/domain/http';
import {
    buildImageTagSnippetProvider,
    buildModelSnippetProvider,
    buildMSnippetProvider,
    buildTemplateTagSnippetProvider,
    SnippetProvider,
} from '@/domain/snippets';
import { buildTplDefinitionProvider, DefinitionProvider } from './definitions';
import { immutable } from '@/common/functional-programming';

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

    const _documentationHoverProviders = [
        buildActionHoverProvider,
        buildBuiltInTagHoverProvider,
        buildFilterHoverProvider,
        buildModelHoverProvider,
        buildModuleTagHoverProvider,
        buildTranslationHoverProvider,
        buildValidatorHoverProvider,
    ];

    _documentationHoverProviders.forEach((hoverProvider) => {
        _hoverProviders.push(
            hoverProvider({
                host: args.host,
                httpRequest: args.httpRequest,
            }),
        );
    });

    const _definitionProviders: DefinitionProvider[] = [
        buildTplDefinitionProvider(),
    ];

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
