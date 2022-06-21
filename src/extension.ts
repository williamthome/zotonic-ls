// The module "vscode" contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { ExtensionContext } from "vscode";
import { Tpl } from "./tpl";
import { TplParser } from "./tplParser";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log("Congratulations, your extension 'zotonic' is now active!");

	const tpl = new Tpl();
	await tpl.setup();

	const tplParser = new TplParser();
	await tplParser.setup(tpl, context);
}

// this method is called when your extension is deactivated
export function deactivate() { }
