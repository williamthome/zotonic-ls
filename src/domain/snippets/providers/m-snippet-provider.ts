import { PopUpSnippetsCommand } from '../../../domain/commands';
import { buildSnippetProvider, buildSnippet } from '../../../domain/snippets';

export function buildMSnippetProvider() {
    return buildSnippetProvider({
        regex: /(?<={%|{{|%{|\[).*?\bm(\.)?\b/,
        getSnippets() {
            return Promise.resolve([
                buildSnippet({
                    label: 'm',
                    body: 'm.',
                    description: 'Provide data to templates.',
                    command: function (commands: {
                        popUpSnippets: PopUpSnippetsCommand;
                    }) {
                        return commands.popUpSnippets();
                    },
                }),
            ]);
        },
    });
}
