# lsg-stack

## Quick start

Install pnpm (if not already installed):

```{sh}
npm i -g pnpm
```

Update pnpm:

```{sh}
pnpm add -g pnpm
```

Install dependencies:

```{sh}
pnpm i
```

Generate types and seed database: (_This is important!_)

```{sh}
pnpm new
```

Store the encryption password for the CMS authentication cookie in `.env.local`. Make sure to keep it **secret** (in production):

```{sh}
# /.env.local
API_AUTH_SECRET=<30-50 character random password without quotation (f.e. from https://1password.com/password-generator/)>
```

Start the local development server:

```{sh}
pnpm dev
```

Open the project in **Visual Studio Code**, trust the project and install all recommended extensions.

Happy hacking! 🥳

## Recommendations for VSCode

The workspace settings and recommended extensions in this repository are limited to basic support for the technologies used. If you haven't already configured your editor to your liking, here are some more recommendations:

VSCode user preferences (Open via command palette (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>) -> `Preferences: Open Settings (JSON)`)

```{json}
{
  "editor.bracketPairColorization.enabled": true,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": true,
  "editor.fontFamily": "\"<Install a Nerd Font (https://www.nerdfonts.com), insert its full name here>\", \"Fira Code\", monospace",
  "editor.fontLigatures": true,
  "editor.formatOnPaste": true,
  "editor.formatOnSave": true,
  "editor.guides.bracketPairs": "active",
  "editor.inlineSuggest.enabled": true,
  "editor.linkedEditing": true,
  "editor.smoothScrolling": true,
  "editor.suggest.preview": true,
  "editor.suggestSelection": "first",
  "editor.wordWrap": "on",
  "emmet.triggerExpansionOnTab": true,
  "javascript.inlayHints.enumMemberValues.enabled": true,
  "javascript.updateImportsOnFileMove.enabled": "always",
  "prettier.requireConfig": true,
  "prettier.useEditorConfig": true,
  "prettier.withNodeModules": false,
  "stylelint.reportInvalidScopeDisables": true,
  "stylelint.reportNeedlessDisables": true,
  "telemetry.telemetryLevel": "off",
  "terminal.integrated.cursorBlinking": true,
  "terminal.integrated.cursorStyle": "line",
  "typescript.inlayHints.enumMemberValues.enabled": true,
  "typescript.updateImportsOnFileMove.enabled": "always",
  "window.autoDetectColorScheme": true,
  "workbench.iconTheme": "<file icon theme>",
  "workbench.list.smoothScrolling": true,
  "workbench.preferredDarkColorTheme": "<dark color scheme>",
  "workbench.preferredHighContrastColorTheme": "<high contrast color scheme>",
  "workbench.preferredLightColorTheme": "<light color scheme>",
  "workbench.productIconTheme": "<product icon theme>"
}
```

A few theme recommendations if the default themes (<kbd>Ctrl</kbd> + <kbd>K</kbd> + <kbd>T</kbd> (color scheme), <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> -> `Preferences: Product Icon Theme`/`Preferences: File Icon Theme`) don't suit you:

-   [Andromeda Color Scheme](https://marketplace.visualstudio.com/items?itemName=EliverLara.andromeda)
-   [Fluent Product Icon Theme ✨](https://marketplace.visualstudio.com/items?itemName=miguelsolorio.fluent-icons)
-   [GitHub Color Scheme ✨](https://marketplace.visualstudio.com/items?itemName=GitHub.github-vscode-theme)
-   [Material Product Icon Theme](https://marketplace.visualstudio.com/items?itemName=PKief.material-product-icons)
-   [Material Color Scheme](https://marketplace.visualstudio.com/items?itemName=Equinusocio.vsc-material-theme)
-   [Material File Icon Theme](https://marketplace.visualstudio.com/items?itemName=Equinusocio.vsc-material-theme-icons)
-   [Monokai Pro Color Scheme ✨](https://marketplace.visualstudio.com/items?itemName=monokai.theme-monokai-pro-vscode)
-   [One Dark Pro Color Scheme](https://marketplace.visualstudio.com/items?itemName=zhuangtongfa.Material-theme)
-   [Palenight Color Scheme](https://marketplace.visualstudio.com/items?itemName=whizkydee.material-palenight-theme)
-   [Shades of Purple Color Scheme](https://marketplace.visualstudio.com/items?itemName=ahmadawais.shades-of-purple)

Some extension recommendations:

-   [Better Comments](https://marketplace.visualstudio.com/items?itemName=aaron-bond.better-comments)
-   [Colorize](https://marketplace.visualstudio.com/items?itemName=kamikillerto.vscode-colorize)
-   [EasyZoom](https://marketplace.visualstudio.com/items?itemName=NabeelValley.easyzoom)
-   [GitLens - Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
-   [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
-   [Quokka.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.quokka-vscode)
-   [Sort JSON objects](https://marketplace.visualstudio.com/items?itemName=richie5um2.vscode-sort-json)
-   [Tabnine AI Autocompletion](https://marketplace.visualstudio.com/items?itemName=TabNine.tabnine-vscode)
-   [NPM Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)
-   [Visual Studio IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)
-   [Wallaby.js](https://marketplace.visualstudio.com/items?itemName=WallabyJs.wallaby-vscode)

That's it, you're good to go! 🤩

## Quick notes

-   Regenerate auto-generated types after changing graphql-related code:
    -   On the client-side (Apollo Client): `pnpm apollo:watch`
    -   In the schema folder (Nexus): `pnpm nexus:watch` (Doesn't appear to do anything right now -> just run the dev server `pnpm dev` in the background)
    -   In the `schema.prisma` file (Prisma): `pnpm prisma:watch`
    -   **Regenerate everything**: `pnpm generate` (once) / `pnpm watch` (until killed)
-   Restart the `ESLint language server` from the VSCode command palette after changing graphql-related code **AND** regenerating the automated typings

## Developer Documentation

See [Docs](DOCS.md)

## Todo

See [Todo](TODO.md)
