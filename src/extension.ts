// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "zotonic" is now active!');

	// BUG: This hiddens snippets/tpl.code-snippets
	// Completion provider
	// @see https://github.com/microsoft/vscode-extension-samples/blob/main/completions-sample/src/extension.ts
	const completionProvider = vscode.languages.registerCompletionItemProvider('tpl', {
		async provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			token: vscode.CancellationToken,
			context: vscode.CompletionContext
		) {
			// Include snippet
			const includeOptions = await filesToSnippetOption(
				'**/priv/templates/**/*.tpl'
			);
			const includeSnippet = new vscode.CompletionItem('include');
			includeSnippet.insertText = new vscode.SnippetString(
				'{% include "${1|' + includeOptions + '|}" %}'
			);
			const includeDocs: any = new vscode.MarkdownString(
				"Inserts a snippet that lets you select a template."
			);
			includeSnippet.documentation = includeDocs;

			// Lib snippet
			const libOptions = await filesToSnippetOption(
				'**/priv/lib/**/*.{js,css}', 'lib/'
			);
			const libSnippet = new vscode.CompletionItem('lib');
			libSnippet.insertText = new vscode.SnippetString(
				'{% lib "${1|' + libOptions + '|}" %}'
			);
			const libDocs: any = new vscode.MarkdownString(
				"Inserts a snippet that lets you select a lib."
			);
			libSnippet.documentation = libDocs;

			// Return
			return [
				includeSnippet,
				libSnippet
			];
		}
	});

	context.subscriptions.push(completionProvider);

	const definitionProvider = vscode.languages.registerDefinitionProvider('tpl', {
		async provideDefinition(document, position, token) {
			const line = document.lineAt(position.line).text;
			const definitions = [
				{ext: ".tpl", dir: "templates"},
				{ext: ".js", dir: "priv/lib"},
				{ext: ".css", dir: "priv/lib"}
			];

			for (const {ext, dir} of definitions) {
				const regex = new RegExp(`".*.\\${ext}"`);
				const match = line.match(regex);
				if (!match || !match.length) continue;

				const firstMatch = match[0].trim();
				const unquotedMatch = firstMatch.replace(/\"/g, "");
				const pattern = `**/${dir}/**/${unquotedMatch}`;
				const files = await vscode.workspace.findFiles(pattern);
				if (!files) continue;

				return files.map(uri => new vscode.Location(
					uri, new vscode.Position(0, 0)
				))
			}
	   }
	});

	context.subscriptions.push(definitionProvider);

	const hoverProvider = vscode.languages.registerHoverProvider('tpl', {
		provideHover(document, position, token) {
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);

			const markdown = new vscode.MarkdownString(`<h1>This is a hint</h1><p>Current word: ${word}</p>`);
			markdown.supportHtml = true;

			return new vscode.Hover(markdown);
		}
	});

	context.subscriptions.push(hoverProvider);
}

// this method is called when your extension is deactivated
export function deactivate() { }

// Output: 'foo.ext,bar.ext,baz.ext'
async function filesToSnippetOption(
	pattern: string,
	lastToken: string = '/'
): Promise<string> {
	// TODO: Improve algorithm
	const templatesSet = new Set<string>();
	const templatesUri = await vscode.workspace.findFiles(pattern);
	templatesUri.forEach(({path}) => {
		const fileName = path.substring(path.lastIndexOf(lastToken) + lastToken.length)
		templatesSet.add(fileName)
	});
	const templatesArray = Array.from(templatesSet);
	const templatesSorted = templatesArray.sort();
	return templatesSorted.join(",");
}
