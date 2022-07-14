[!["Sponsor"](https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86)](<[https://www.buymeacoffee.com/williamthome](https://github.com/sponsors/williamthome)>)
![GitHub Repo stars](https://img.shields.io/github/stars/williamthome/zotonic-ls?style=social)
![License](https://img.shields.io/github/license/williamthome/zotonic-ls)
![GitHub CI Status](https://img.shields.io/github/workflow/status/williamthome/zotonic-ls/CI)
![Lines of code](https://img.shields.io/tokei/lines/github/williamthome/zotonic-ls)
[![Coverage Status](https://coveralls.io/repos/github/williamthome/zotonic-ls/badge.svg?branch=main)](https://coveralls.io/github/williamthome/zotonic-ls?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/williamthome/zotonic-ls/badge.svg)](https://snyk.io/test/github/williamthome/zotonic-ls)
![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/williamthome.zotonic-ls)
![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/williamthome.zotonic-ls)
![Visual Studio Marketplace Rating (Stars)](https://img.shields.io/visual-studio-marketplace/stars/williamthome.zotonic-ls)

# Zotonic Language Server

Language server for [Zotonic](http://zotonic.com/), the Erlang Web Framework.

## Features

### Syntax highlight

Syntax highlight for Zotonic Template Language (.tpl).

![Syntax highlight](images/syntax-highlight.gif)

### Snippets

Zotonic completion for `.tpl` and `Erlang` files by pressing <kbd>Ctrl</kbd> + <kbd>Space</kbd>.\
In template files use `act` prefix for [actions](http://docs.zotonic.com/en/latest/ref/actions/), `m` for [models](http://docs.zotonic.com/en/latest/ref/models/), `val` for [validators](http://docs.zotonic.com/en/latest/ref/validators/index.html#validators), `|` for [filters](http://docs.zotonic.com/en/latest/ref/filters/) and for [tags](http://docs.zotonic.com/en/latest/ref/tags/) just the tag name.\
Also some special completions are provided, like the atoms `true`, `false` and `undefined`, `for` loops, `map` tag and more.

![Snippets](images/snippets.gif)

#### Models

A great help is the models snippets. Typing `m.` all models are listed and picking one shows all `m_get` possibilities.

![m_get snippets](images/m_get_snippets.gif)

#### Other languages completions

-   HTML: Typing `<` outside a `.tpl` expression popups HTML snippets.

### Go to definition

Navigate to files in the `.tpl` by pressing <kbd>Ctrl</kbd> + <kbd>Click</kbd> over file names.

![Go to definition](images/go-to-definition.gif)

### Docs integration

Zotonic documentation is displayed hovering tags, actions, filters, validators, models and translations.

![Docs integration](images/docs-integration.gif)

## Insltalation

### VSCode

Download and install the extension for free at the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=williamthome.zotonic-ls) or directly in the VSCode extensions feature.

## Todo

### Syntax Highlight

-   Improve semantic highlight. See:
    -   [Writing a TextMate Grammar: Some Lessons Learned](https://www.apeth.com/nonblog/stories/textmatebundle.html)
    -   [Semantic Highlight Guide](https://code.visualstudio.com/api/language-extensions/semantic-highlight-guide)

### Snippets

-   Review arguments and tabstops;
-   CSS completions;
-   Javascript completions.

### Docs

-   Review links;
-   Improve style.

## Sponsors

If you like this tool, please consider [sponsoring me](https://github.com/sponsors/williamthome).\
I'm thankful for your never-ending support :heart:

I also accept coffees :coffee:

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/williamthome)

Special thanks go to [@mworrel](https://github.com/mworrell) for buying me 5x coffees! o/

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

### Extensions

Make sure you have [ESlint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) and [Prettier ESLint](https://marketplace.visualstudio.com/items?itemName=rvest.vs-code-prettier-eslint) extensions installed.

Optionally you can install the [Todo Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree) extension to see things <span style="color: green;">_TODO_</span>, to <span style="color: yellow;">_FIXME_</span>, or <span style="color: red;">_BUG_</span>.

#### Config

-   Open user or workspace `settings.json` by:
    -   Windows/Linux: <kbd>CTRL</kbd> + <kbd>SHIFT</kbd> + <kbd>P</kbd> or `File > Preferences > Settings`
    -   MacOS: <kbd>CMD</kbd> + <kbd>SHIFT</kbd> + <kbd>P</kbd> or `Code > Preferences > Settings`
-   Add this to the settings file:

```json
"editor.defaultFormatter": "rvest.vs-code-prettier-eslint",
"editor.formatOnSave": true,
```

### Debugging the extension

Press <kbd>F5</kbd> to start debugging.
To reload, if in dev window, press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>F5</kbd> or, if in extension host window, <kbd>Ctrl</kbd> + <kbd>R</kbd>.

[See this article](https://code.visualstudio.com/api/get-started/your-first-extension) for more information about debugging.
