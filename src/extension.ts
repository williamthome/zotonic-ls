// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "zotonic" is now active!');

	// TODO: Improve the "go to definition" highlight.
	//       e.g.:
	//         {% lib "js/modules/http_ping.js" %}
	//         Pressing control over `http_ping` highlight only the `http_ping`,
	//         but `js/modules/http_ping.js` should be highlighted,
	//      @see this question in StackOverflow here https://stackoverflow.com/questions/72554515/go-to-definition-highlight-in-vscode-lsp
	const definitionProvider = vscode.languages.registerDefinitionProvider('tpl', {
		async provideDefinition(document, position, _token) {
			const wordRange = document.getWordRangeAtPosition(position, /(?<=").*?(?=")/)
			if (!wordRange || wordRange.isEmpty) return

			const text = document.getText(wordRange)
			const lastDotIndex = text.lastIndexOf(".")
			if (lastDotIndex <= 0) return

			const ext = text.substring(lastDotIndex)
			if (!ext) return

			const lastSlashIndex = text.lastIndexOf("/")
			const fileName = text.substring(lastSlashIndex).replace("/", "")
			if (!fileName) return

			const tplLocationPattern = "**/priv/templates/**/"
			const jsLocationPattern = "**/priv/lib/**/"
			const cssLocationPattern = "**/priv/lib/**/"
			const imageLocationPattern = "**/priv/lib/images/**/"

			const extLocationPattern = {
				".tpl": tplLocationPattern,
				".js": jsLocationPattern,
				".css": cssLocationPattern,
				".apng": imageLocationPattern,
				".gif": imageLocationPattern,
				".ico": imageLocationPattern,
				".cur": imageLocationPattern,
				".jpg": imageLocationPattern,
				".jpeg": imageLocationPattern,
				".jfif": imageLocationPattern,
				".pjpeg": imageLocationPattern,
				".pjp": imageLocationPattern,
				".png": imageLocationPattern,
				".svg": imageLocationPattern,
			}

			const locationPattern = extLocationPattern[ext as keyof typeof extLocationPattern]
			if (!locationPattern) return

			const filePattern = `${locationPattern}${fileName}`;
			const ignorePattern = "**/_build/**"

			const files = await vscode.workspace.findFiles(filePattern, ignorePattern);
			if (!files) return;

			return files.map(uri => new vscode.Location(
				uri, new vscode.Position(0, 0)
			))
		}
	});

	context.subscriptions.push(definitionProvider);
}

// this method is called when your extension is deactivated
export function deactivate() { }
