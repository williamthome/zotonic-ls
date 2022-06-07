# Zotonic Language Server

Language server for [Zotonic](http://zotonic.com/), the Erlang Web Framework.

## Features

### Syntax highlight

Syntax highlight for Zotonic Template Language (.tpl).

![Syntax highlight](images/syntax-highlight.gif)

### Snippets

Zotonic completion for .tpl and Erlang files.

## Roadmap

- Template search
- Go to template
- Docs integration

## Todo

- Improve semantic highlight
> * [Writing a TextMate Grammar: Some Lessons Learned](https://www.apeth.com/nonblog/stories/textmatebundle.html)
> * [Semantic Highlight Guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)
- Snippets
> Review arguments and tabstops
- Template search
- Go to definition in template
- Zotonic docs integration

## Backers

## [!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/williamthome)

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
