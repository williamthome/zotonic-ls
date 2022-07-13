import { transform } from '@/common/functional-programming';
import {
    CommandCallback,
    GetUserChoiceCommand,
    InsertSnippetCommand,
} from '@/domain/commands';
import { FilesByGlobPattern } from '@/domain/files';
import { buildSnippetProviderFromFiles } from '@/domain/snippets';

export function buildModelSnippetProvider(args: {
    filesByGlobPattern: FilesByGlobPattern;
    workspacesRoot: [string, ...string[]];
}) {
    return buildSnippetProviderFromFiles({
        regex: /(?<={%|{{|%{|\[).*?\bm\.(\w+)?/,
        workspaces: [['src', 'models']],
        extensions: ['erl'],
        filenameRegexByWorkspace() {
            return /(?<=\bm_).*?(?=.erl)/;
        },
        transformSnippet({ snippet }) {
            const transformedSnippet = transform(snippet, {
                description:
                    'A model located at "<apps|apps_user>/<module>/src/models".',
                command: async function (commands: {
                    getUserChoice: GetUserChoiceCommand;
                    insertSnippet: InsertSnippetCommand;
                }) {
                    // TODO
                    const modelExpressions = ['a', 'b', 'c'];

                    await commands.getUserChoice({
                        choices: modelExpressions,
                        onChoiceSelected: async function (choice) {
                            if (!choice) {
                                return;
                            }
                            await commands.insertSnippet({ snippet: choice });
                        },
                    });
                } as CommandCallback,
            });
            return transformedSnippet;
        },
        filesByGlobPattern: args.filesByGlobPattern,
        workspacesRoot: args.workspacesRoot,
    });
}
