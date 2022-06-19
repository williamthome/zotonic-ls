/**
 * Compatible with snippets JSON format.
 * @see https://code.visualstudio.com/docs/editor/userdefinedsnippets#_create-your-own-snippets
 */
export type ITplSnippet = {
    prefix: string,
    body: string | [string, ...string[]],
    description?: string,
    documentation?: string
};
