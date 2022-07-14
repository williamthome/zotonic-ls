import { PopUp } from '@/domain/pop-up';
import { MarkdownString } from 'vscode';

export function formatPopUp(popUp: PopUp | undefined) {
    switch (popUp?.format) {
        case 'plaintext':
            return popUp.text;
        case 'html':
            return htmlToMarkdown(popUp.text);
    }

    return '';
}

export function htmlToMarkdown(html: string) {
    const markdown = new MarkdownString(html.trim());
    markdown.supportHtml = true;
    markdown.isTrusted = true;
    markdown.supportThemeIcons = true;

    return markdown;
}
