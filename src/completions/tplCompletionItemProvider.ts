import {
    CancellationToken,
    CompletionContext,
    CompletionItem,
    CompletionItemKind,
    CompletionItemProvider,
    MarkdownString,
    Position,
    TextDocument
} from "vscode";

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

export type ITplCompletionItemProvider = CompletionItemProvider & {
    selector: string,
    pattern: RegExp,
    loadSnippets(): Promise<ITplSnippet[] | undefined>
};

interface ConstructorArgs {
    pattern: RegExp,
    selector?: string
}

export abstract class TplCompletionItemProvider implements ITplCompletionItemProvider {
    public abstract loadSnippets(): Promise<ITplSnippet[]>;

    public pattern: RegExp;
    public selector: string;

    private _snippets: ITplSnippet[] | undefined;
    private _completionItems: CompletionItem[] | undefined;

    constructor({ pattern, selector }: ConstructorArgs) {
        this.pattern = pattern;
        this.selector = selector || "tpl";
    }

    public async provideCompletionItems(
        document: TextDocument,
        position: Position,
        _token: CancellationToken,
        _context: CompletionContext
    ): Promise<CompletionItem[] | undefined> {
        return document.getWordRangeAtPosition(position, this.pattern)
            ? await this.getCompletionItems()
            : undefined;
    }

    // Internal functions

    private doSnippet(snippet: ITplSnippet) {
        const completionItem = new CompletionItem(
            snippet.prefix, CompletionItemKind.Snippet
        );
        completionItem.insertText = Array.isArray(snippet.body)
            ? snippet.body.join("\n")
            : snippet.body;
        completionItem.detail = snippet.description;

        if (snippet.documentation) {
            const documentation = new MarkdownString(snippet.documentation.trim());
            documentation.supportHtml = true;
            documentation.isTrusted = true;
            completionItem.documentation = documentation;
        }

        return completionItem;
    }

    private async getSnippets() {
        if (!this._snippets) {
            this._snippets = await this.loadSnippets();
        }
        return this._snippets;
    }

    private async getCompletionItems() {
        if (!this._completionItems) {
            const snippets = await this.getSnippets();
            this._completionItems = snippets.map(this.doSnippet);
        }
        return this._completionItems;
    }
}
