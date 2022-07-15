import { window } from 'vscode';
import { getLanguageService as getHtmlLanguageService } from 'vscode-html-languageservice';
import { zObj } from './domain/z-obj';
import { buildHttpRequest } from './infra/http';
import { buildFilesByGlobPattern } from './infra/vscode';

export function buildEnv() {
    // User
    // TODO: Get values from user config
    const zotonicVersion = 'master';

    // Common
    const filesByGlobPattern = buildFilesByGlobPattern();

    // Domain
    const workspacesRoot: [string, ...string[]] = ['apps', 'apps_user'];
    const host = `https://raw.githubusercontent.com/zotonic/zotonic/${zotonicVersion}/doc`;
    const httpRequest = buildHttpRequest();

    // Infra
    const editor = window.activeTextEditor;
    if (!editor) {
        throw new Error('No editor active');
    }
    const htmlLanguageService = getHtmlLanguageService();

    return zObj('env', {
        zotonicVersion,
        filesByGlobPattern,
        workspacesRoot,
        host,
        httpRequest,
        editor,
        htmlLanguageService,
    });
}
