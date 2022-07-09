import { Doc } from '@/domain/doc';
import { MarkdownString } from 'vscode';

export function formatDoc(doc: Doc | undefined) {
    switch (doc?.format) {
        case 'plaintext':
            return doc.text;
        case 'html':
            return htmlToMarkdown(doc.text);
    }

    return '';
}

export function htmlToMarkdown(html: string) {
    const markdown = new MarkdownString(html.trim());
    markdown.supportHtml = true;
    markdown.isTrusted = true;
    return markdown;
}
