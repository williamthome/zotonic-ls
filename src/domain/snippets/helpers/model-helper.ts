import * as fs from 'fs';
import {
    buildSnippetToken,
    SnippetToken,
    reduceSnippetTokens,
} from './snippet-helper';

// Defs

export type Expression = {
    expression: string;
    tokens: SnippetToken[];
    snippet: string;
};

export type FindFile = (pattern: string) => Promise<string | undefined>;

type Behaviour = 'm_get' | 'm_post' | 'm_delete';

// API

export function mGetExpressions(args: { filePath: string; model: string }) {
    return getFileExpressions({
        behaviour: 'm_get',
        re: /(?<=m_get\s*\(\s*\[\s*)(\w|<|\{).*?(?=\s*(\||\]))/g,
        filePath: args.filePath,
        model: args.model,
    });
}

// Internal functions

async function getFileExpressions(args: {
    behaviour: Behaviour;
    re: RegExp;
    filePath: string;
    model: string;
}) {
    const data = await fs.promises.readFile(args.filePath, {
        encoding: 'utf8',
    });
    const matches = data.match(args.re);
    if (!matches) {
        return new Error(
            `No '${args.behaviour}' functions found in '${args.model}' model.`,
        );
    }

    return matches.map(parseExpression);
}

function parseExpression(expression: string) {
    const re = /\s*,\s*(?=(?:[^{]*{[^}]*})*[^}]*$)/;
    const tokens = expression
        .split(re)
        .flatMap<SnippetToken>(parseExpressionToken);
    const snippet = reduceSnippetTokens(tokens);

    return {
        expression,
        tokens,
        snippet,
    };
}

function parseExpressionToken(data: string) {
    const constantRe = /(?<=<<").*?(?=">>)/;
    const constantMatch = constantRe.exec(data);

    if (constantMatch && constantMatch.length === 1) {
        return [
            buildSnippetToken({
                token: constantMatch[0],
                prefix: '.',
            }),
        ];
    } else {
        const propsRe = /(?<=\{\s*)(\w+)(?:\s*,\s*)(\w+)(?=\s*\})/;
        const propsMatch = propsRe.exec(data);
        if (propsMatch && propsMatch.length === 3) {
            return [
                buildSnippetToken({
                    token: propsMatch[1],
                    editable: true,
                    prefix: '[{',
                }),
                buildSnippetToken({
                    token: 'Prop',
                    editable: true,
                    prefix: ' ',
                    suffix: '=',
                }),
                buildSnippetToken({
                    token: 'Value',
                    editable: true,
                    suffix: '}]',
                }),
            ];
        } else {
            const paramRe = /\w+/;
            const paramMatch = paramRe.exec(data);
            if (paramMatch && paramMatch.length === 1) {
                return [
                    buildSnippetToken({
                        token: data,
                        editable: true,
                        prefix: '[',
                        suffix: ']',
                    }),
                ];
            }
        }
    }

    throw new Error(
        `Unexpected no match in expression token parser for data '${data}'`,
    );
}
