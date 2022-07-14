import { transform } from '@/common/functional-programming';
import {
    GetUserChoiceCommand,
    GrowlErrorCommand,
    InsertSnippetCommand,
} from '@/domain/commands';
import { FilesByGlobPattern } from '@/domain/files';
import { mGetExpressions } from '@/domain/helpers/model-helper';
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
        transformSnippet({ snippet, file }) {
            const transformedSnippet = transform(snippet, {
                description:
                    'A model located at "<apps|apps_user>/<module>/src/models".',
                command: async function (commands: {
                    getUserChoice: GetUserChoiceCommand;
                    insertSnippet: InsertSnippetCommand;
                    growlError: GrowlErrorCommand;
                }) {
                    const mGetResult = await mGetExpressions(
                        file.path,
                        file.name,
                    );
                    if (mGetResult instanceof Error) {
                        return commands.growlError({ error: mGetResult });
                    }

                    const modelExpressions = mGetResult.map(
                        (mGet) => mGet.expression,
                    );

                    return commands.getUserChoice({
                        choices: modelExpressions,
                        onChoiceSelected: async function (choice) {
                            if (!choice) {
                                return;
                            }

                            const i = mGetResult.findIndex(
                                (mGet) => mGet.expression === choice,
                            );
                            const snippet = mGetResult[i].snippet;
                            await commands.insertSnippet({ snippet });
                        },
                    });
                },
            });
            return transformedSnippet;
        },
        filesByGlobPattern: args.filesByGlobPattern,
        workspacesRoot: args.workspacesRoot,
    });
}
