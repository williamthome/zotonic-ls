// Defs

export type Doc = {
    pattern: RegExp,
    genUri: (token: string) => string,
    tokens?: string[]
}

export type Docs = { [key: string]: Doc }

// API

export default function (docs: Docs, language: string, version: string, branch: string) {
    return function (patternMatch: (pattern: RegExp) => string | undefined) {
        const uri = maybeGenDocUri(docs, patternMatch)
        return {
            uri: maybeGenDocUri(docs, patternMatch),
            url: uri ? genDocUrl(language, version, uri) : undefined,
            raw: uri ? genDocRawUrl(branch, uri) : undefined,
        }
    }
}

// Internal functions

function genDocUrl(language: string, version: string, uri = "/") {
    return `http://docs.zotonic.com/${language}/${version}${uri}`
}

function genDocRawUrl(branch: string, uri: string) {
    return `https://raw.githubusercontent.com/zotonic/zotonic/${branch}/doc${uri}.rst`
}

function maybeGenDocUri(
    docs: Docs,
    patternMatch: (pattern: RegExp) => string | undefined
) {
    for (const doc of Object.values(docs)) {
        const token = patternMatch(doc.pattern)
        if (!token || (doc.tokens?.length && !doc.tokens.includes(token))) continue
        return doc.genUri(token)
    }
}
