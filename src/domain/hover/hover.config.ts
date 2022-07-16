import { HttpRequest } from '../http';
import { HoverProvider } from './hover-provider';
import {
    buildActionHoverProvider,
    buildBuiltInTagHoverProvider,
    buildFilterHoverProvider,
    buildModelHoverProvider,
    buildModuleTagHoverProvider,
    buildTranslationHoverProvider,
    buildValidatorHoverProvider,
} from './providers';

export function buildHoverProviders(args: {
    host: string;
    httpRequest: HttpRequest;
}) {
    const hoverProviders: HoverProvider[] = [];

    const documentationHoverProviders = [
        buildActionHoverProvider,
        buildBuiltInTagHoverProvider,
        buildFilterHoverProvider,
        buildModelHoverProvider,
        buildModuleTagHoverProvider,
        buildTranslationHoverProvider,
        buildValidatorHoverProvider,
    ];
    documentationHoverProviders.forEach((hoverProvider) => {
        hoverProviders.push(
            hoverProvider({
                host: args.host,
                httpRequest: args.httpRequest,
            }),
        );
    });

    return hoverProviders;
}
