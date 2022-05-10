// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as vscodeHtmlLanguageService from 'vscode-html-languageservice';
import axios from 'axios';

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
			const htmlLanguageService = vscodeHtmlLanguageService.getLanguageService();
			const htmlTextDocument = vscodeHtmlLanguageService.TextDocument.create(document.uri.path, document.languageId, document.version, document.getText());
			const htmlDocument = vscodeHtmlLanguageService.getLanguageService().parseHTMLDocument(htmlTextDocument);
			const htmlCompletionList = htmlLanguageService.doComplete(htmlTextDocument, position, htmlDocument)
			if (htmlCompletionList.items.length) return htmlCompletionList as vscode.CompletionList;

			const templateOptions = await filesToSnippetOption(
				'**/priv/templates/**/*.tpl'
			);

			// Include snippet
			const includeSnippet = new vscode.CompletionItem('include');
			includeSnippet.insertText = new vscode.SnippetString(
				'{% include "${1|' + templateOptions + '|}" %}'
			);
			const includeDocs: any = new vscode.MarkdownString(
				"Inserts a snippet that lets you select a template to include."
			);
			includeSnippet.documentation = includeDocs;

			// All include snippet
			const allIncludeSnippet = new vscode.CompletionItem('all_include');
			allIncludeSnippet.insertText = new vscode.SnippetString(
				'{% all include "${1|' + templateOptions + '|}" %}'
			);
			const allIncludeDocs: any = new vscode.MarkdownString(
				"Inserts a snippet that lets you select a template to include."
			);
			allIncludeSnippet.documentation = allIncludeDocs;

			// Extends snippet
			const extendsSnippet = new vscode.CompletionItem('extends');
			extendsSnippet.insertText = new vscode.SnippetString(
				'{% extends "${1|' + templateOptions + '|}" %}'
			);
			const extendsDocs: any = new vscode.MarkdownString(
				"Inserts a snippet that lets you select a template to extends."
			);
			extendsSnippet.documentation = extendsDocs;

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

			return [
				includeSnippet,
				allIncludeSnippet,
				extendsSnippet,
				libSnippet
			];
		}
	});

	context.subscriptions.push(completionProvider);

	const definitionProvider = vscode.languages.registerDefinitionProvider('tpl', {
		async provideDefinition(document, position, token) {
			const line = document.lineAt(position.line).text;
			const definitions = [
				{ ext: ".tpl", dir: "templates" },
				{ ext: ".js", dir: "priv/lib" },
				{ ext: ".css", dir: "priv/lib" }
			];

			for (const { ext, dir } of definitions) {
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
		async provideHover(document, position, token) {
			const range = document.getWordRangeAtPosition(position);
			const word = document.getText(range);

			const raw = await raw_doc(word);
			const markdown = new vscode.MarkdownString(raw);
			markdown.supportHtml = true;
			markdown.isTrusted = true;
			markdown.supportThemeIcons = true;

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
	templatesUri.forEach(({ path }) => {
		const fileName = path.substring(path.lastIndexOf(lastToken) + lastToken.length)
		templatesSet.add(fileName)
	});
	const templatesArray = Array.from(templatesSet);
	const templatesSorted = templatesArray.sort();
	return templatesSorted.join(",");
}

// Get raw data from Zotonic docs
async function raw_doc(word: string) {
	try {
		// TODO: Change strategy
		const docs = {
			block: { group: "tags", ref: "tag" },
			extends: { group: "tags", ref: "tag" },
			include: { group: "tags", ref: "tag" },
			wire: { group: "scomps", ref: "scomp" }
		};
		if (!(word in docs)) return "No doc for " + word;
		const { group, ref } = docs[word as keyof typeof docs];
		const url = `https://raw.githubusercontent.com/zotonic/zotonic/master/doc/ref/${group}/${ref}_${word}.rst`
		const { data: raw } = await axios.get(url);
		return raw
	} catch (error) {
		return (error as any).toString()
	}
}
