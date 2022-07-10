// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext } from 'vscode';
import { buildZ } from './domain/z';
import { buildHttpRequest } from './infra/http';
import { buildZVSCode, buildFilesByGlobPattern } from './infra/vscode';
// import { Zotonic } from './zotonic';
// import { ZotonicVSCode } from './zotonic-vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log("Congratulations, your extension 'zotonic' is now active!");

    // TODO: Get version from user config
    // const version = 'master';
    // const docHost = `https://raw.githubusercontent.com/zotonic/zotonic/${version}/doc`;
    // const zotonic = new Zotonic({ docHost });
    // zotonic.setup();

    // const zotonicVSCode = new ZotonicVSCode();
    // zotonicVSCode.setup(zotonic, context);

    const filesByGlobPattern = buildFilesByGlobPattern();
    const workspacesRoot: [string, ...string[]] = ['apps', 'apps_user'];
    const zotonicVersion = 'master';
    const host = `https://raw.githubusercontent.com/zotonic/zotonic/${zotonicVersion}/doc`;
    const httpRequest = buildHttpRequest();

    const z = buildZ({
        filesByGlobPattern,
        workspacesRoot,
        host,
        httpRequest,
    });

    const zVSCode = buildZVSCode({
        z,
        context,
        filesByGlobPattern,
    });
    zVSCode.setup();
}

// this method is called when your extension is deactivated
// export function deactivate() { }
