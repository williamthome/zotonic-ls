import * as fs from 'fs';

// Defs

export type Token = {
    token: string;
    editable?: boolean;
    prefix?: string;
    suffix?: string;
};

export type Expression = {
    expression: string;
    tokens: Array<Token>;
    snippet: string;
};

export type FindFile = (pattern: string) => Promise<string | undefined>;

type Behaviour = 'm_get' | 'm_post' | 'm_delete';

// API

export async function mGetExpressions(filePath: string, model: string) {
    const re = /(?<=m_get\s*\(\s*\[\s*)(\w|<|\{).*?(?=\s*(\||\]))/g;
    return await getFileExpressions('m_get', re, filePath, model);
}

// Internal functions

async function getFileExpressions(
    behaviour: Behaviour,
    re: RegExp,
    filePath: string,
    model: string,
) {
    const data = await fs.promises.readFile(filePath, {
        encoding: 'utf8',
    });
    const matches = data.match(re);
    if (!matches) {
        return new Error(
            `The model '${model}' has no '${behaviour}' functions.`,
        );
    }

    return matches.map(parseExpression);
}

function parseExpression(expression: string) {
    const re = /\s*,\s*(?=(?:[^{]*{[^}]*})*[^}]*$)/;
    const tokens = expression.split(re).flatMap<Token>(parseExpressionToken);
    const snippet = tokensToSnippet(tokens);

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
            {
                token: constantMatch[0],
                prefix: '.',
            },
        ];
    } else {
        const propsRe = /(?<=\{\s*)(\w+)(?:\s*,\s*)(\w+)(?=\s*\})/;
        const propsMatch = propsRe.exec(data);
        if (propsMatch && propsMatch.length === 3) {
            return [
                {
                    token: propsMatch[1],
                    editable: true,
                    prefix: '[{',
                },
                {
                    token: 'Prop',
                    editable: true,
                    prefix: ' ',
                    suffix: '=',
                },
                {
                    token: 'Value',
                    editable: true,
                    suffix: '}]',
                },
            ];
        } else {
            const paramRe = /\w+/;
            const paramMatch = paramRe.exec(data);
            if (paramMatch && paramMatch.length === 1) {
                return [
                    {
                        token: data,
                        editable: true,
                        prefix: '[',
                        suffix: ']',
                    },
                ];
            }
        }
    }
    throw new Error(
        `Unexpected no match in expression token parser for data '${data}'`,
    );
}

function tokensToSnippet(tokens: Array<Token>) {
    return tokens.reduce(
        (snippet, { token, editable, prefix = '', suffix = '' }, i) => {
            const acc = `${prefix}${
                editable ? `\${${i + 1}:${token}}` : token
            }${suffix}`;
            return snippet + acc;
        },
        '',
    );
}
