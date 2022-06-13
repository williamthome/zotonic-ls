// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import axios from "axios";
import config from "./config";
import { mGetExpressions, Expression, FindFile } from './utils/snippets';

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
			const wordRange = document.getWordRangeAtPosition(position, /(?<=").*?(?=")/);
			if (!wordRange || wordRange.isEmpty) { return; };

			const text = document.getText(wordRange);
			const lastDotIndex = text.lastIndexOf(".");
			if (lastDotIndex <= 0) { return; };

			const ext = text.substring(lastDotIndex);
			if (!ext) { return; };

			const lastSlashIndex = text.lastIndexOf("/");
			const fileName = text.substring(lastSlashIndex).replace("/", "");
			if (!fileName) { return; };

			const tplLocationPattern = "**/priv/templates/**/";
			const jsLocationPattern = "**/priv/lib/**/";
			const cssLocationPattern = "**/priv/lib/**/";
			const imageLocationPattern = "**/priv/lib/images/**/";

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
			};

			const locationPattern = extLocationPattern[ext as keyof typeof extLocationPattern];
			if (!locationPattern) { return; };

			const filePattern = `${locationPattern}${fileName}`;
			const ignorePattern = "**/_build/**";

			const files = await vscode.workspace.findFiles(filePattern, ignorePattern);
			if (!files) { return; }

			return files.map(uri => new vscode.Location(
				uri, new vscode.Position(0, 0)
			));
		}
	});

	context.subscriptions.push(definitionProvider);

	const hoverProvider = vscode.languages.registerHoverProvider('tpl', {
		async provideHover(document, position, _token) {
			const patternMatch = (pattern: RegExp) => {
				const wordRange = document.getWordRangeAtPosition(position, pattern);
				return !!wordRange && !wordRange.isEmpty
					? document.getText(wordRange)
					: undefined;
			};

			const doc = config.getDoc(patternMatch);
			if (!doc || !doc.raw) { return; };

			const response = await axios.get(doc.raw);
			if (response.status !== 200) { return; };

			const markdown = new vscode.MarkdownString(response.data);
			markdown.supportHtml = true;
			markdown.isTrusted = true;
			markdown.supportThemeIcons = true;

			return new vscode.Hover(markdown);
		}
	});

	context.subscriptions.push(hoverProvider);

	const completionProvider = vscode.languages.registerCompletionItemProvider('tpl', {
		async provideCompletionItems(
			document: vscode.TextDocument,
			position: vscode.Position,
			_token: vscode.CancellationToken,
			_context: vscode.CompletionContext
		) {
			const modelNameRe = /\bm\.(\w+)?/;
			const modelNameRange = document.getWordRangeAtPosition(position, modelNameRe);
			if (!!modelNameRange && !modelNameRange.isEmpty) {
				const modelsPattern = "{apps,apps_user}/**/src/models/**/m_*.erl";
				const models = await vscode.workspace.findFiles(modelsPattern);
				return models.reduce((arr, file) => {
					const modelRe = /(?<=\bm_).*?(?=.erl)/;
					const modelMatch = modelRe.exec(file.fsPath);
					if (!modelMatch || !modelMatch.length) {
						return arr;
					}

					const model = modelMatch[0];
					const modelExpressionsFinder = (m: string) => mGetExpressions(findFile, m);
					const snippet = new vscode.CompletionItem(model);
					snippet.insertText = new vscode.SnippetString(model);
					snippet.command = {
						command: "tpl.snippet.pick",
						title: "m_get",
						arguments: [model, modelExpressionsFinder]
					};
					arr.push(snippet);
					return arr;
				}, new Array<vscode.CompletionItem>());
			}

			const variableRe = /(?<=\[).*?(?=\])|(?<={).*?(?=})|(?<=:).*?(?=}|,)|(?<==).*?(?=(}|,|%}))/;
			const variableRange = document.getWordRangeAtPosition(position, variableRe);
			if (!!variableRange) {
				// TODO: Variables snippets.
				//       It will be awesome if variables can pop up as suggestion.
				return;
			}

			const mSnippet = new vscode.CompletionItem("m");
			mSnippet.insertText = new vscode.SnippetString("m");

			return [
				mSnippet
			];
		}
	}, ".", "[", "{", "|");

	context.subscriptions.push(completionProvider);

	vscode.commands.registerCommand('tpl.snippet.pick', async (model, modelExpressionsFinder) => {
		const expressions: Array<Expression> = await modelExpressionsFinder(model);
		if (expressions instanceof Error) {
			await vscode.window.showErrorMessage(expressions.message);
			return undefined;
		}

		const quickPick = vscode.window.createQuickPick();
		quickPick.items = expressions.map(({ expression: label }) => ({ label }));
		quickPick.onDidChangeSelection(async ([{ label }]) => {
			const token = expressions.find(token => token.expression === label);
			if (!token) {
				throw (new Error(`Unexpected no token match in quick pick with label '${label}'`));
			}

			await vscode.commands.executeCommand("tpl.snippet.insert", token.snippet);
			quickPick.hide();
		});
		quickPick.show();
	});

	vscode.commands.registerTextEditorCommand('tpl.snippet.insert', (editor, _edit, snippet) => {
		return editor.insertSnippet(
			new vscode.SnippetString(snippet),
		);
	});
}

// this method is called when your extension is deactivated
export function deactivate() { }

// Internal functions

const findFile: FindFile = async (pattern, ignorePattern = null) => {
	const files = await vscode.workspace.findFiles(pattern, ignorePattern, 1);
	return files.length
		? files[0].fsPath
		: undefined;
};
