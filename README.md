# Zotonic Language Server

## Features

### [WIP] Syntax highlight

![Syntax highlight](images/zotonic-ls.v0.0.01-alpha.gif)

## Todo

- Improve semantic highlight
> *refs*:
> * [Writing a TextMate Grammar: Some Lessons Learned](https://www.apeth.com/nonblog/stories/textmatebundle.html)
> * [Semantic Highlight Guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)
- Snippets
- Template search
- Go to definition in template
- Zotonic docs integration

## Contributing

### Issues

Feels free to [submit an issue on Github](https://github.com/vscode-django/vscode-django/issues/new).

### Setup

```bash
git clone https://github.com/williamthome/zotonic-ls
cd zotonic-ls
npm install
code .
```

Make sure you have [TSlint](https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-typescript-tslint-plugin) extension installed.

### Debugging the extension

Press <kbd>F5</kbd> to start debugging.
To reload, if in dev window,  press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F5</kbd> or, if in extension host window, <kbd>Ctrl</kbd> + <kbd>R</kbd>.

[See this article](https://code.visualstudio.com/api/get-started/your-first-extension) for more information about debugging.
