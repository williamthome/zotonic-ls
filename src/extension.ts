// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext } from "vscode";
import { Zotonic } from "./zotonic";
import { ZotonicVSCode } from "./zotonic-vscode";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log("Congratulations, your extension 'zotonic' is now active!");

	const zotonic = new Zotonic();
	zotonic.setup();

	const zotonicVSCode = new ZotonicVSCode();
	zotonicVSCode.setup(zotonic, context);
}

// this method is called when your extension is deactivated
export function deactivate() { }
