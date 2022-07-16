// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext } from 'vscode';
import { buildEnv } from './env';
import { buildZ } from './domain/z';
import { buildZVSCode } from './infra/vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Congratulations, your extension 'zotonic' is now active!");

    // -------------------------------------------------------------------------
    // Enviroment
    // -------------------------------------------------------------------------

    const {
        filesByGlobPattern,
        workspacesRoot,
        host,
        httpRequest,
        activeEditor,
        htmlLanguageService,
    } = buildEnv();

    // -------------------------------------------------------------------------
    // Domain
    // -------------------------------------------------------------------------

    const z = buildZ({
        filesByGlobPattern,
        workspacesRoot,
        host,
        httpRequest,
    });

    // -------------------------------------------------------------------------
    // Infra
    // -------------------------------------------------------------------------

    buildZVSCode({
        z,
        context,
        filesByGlobPattern,
        activeEditor,
        htmlLanguageService,
    }).setup();
}

// this method is called when your extension is deactivated
// export function deactivate() { }
