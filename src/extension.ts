// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext, window } from 'vscode';
import { getLanguageService as getHtmlLanguageService } from 'vscode-html-languageservice';
import { buildZ } from './domain/z';
import { buildHttpRequest } from './infra/http';
import { buildZVSCode, buildFilesByGlobPattern } from './infra/vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Congratulations, your extension 'zotonic' is now active!");

    // -------------------------------------------------------------------------
    // Enviroment
    // -------------------------------------------------------------------------

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

    // -------------------------------------------------------------------------
    // Setup
    // -------------------------------------------------------------------------

    // Domain
    const z = buildZ({
        filesByGlobPattern,
        workspacesRoot,
        host,
        httpRequest,
    });

    // Infra
    const zVSCode = buildZVSCode({
        z,
        context,
        filesByGlobPattern,
        editor,
        htmlLanguageService,
    });
    zVSCode.setup();
}

// this method is called when your extension is deactivated
// export function deactivate() { }
