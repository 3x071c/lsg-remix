<h1 align="center" style="border: none; padding: 0; margin: 0;">📚 Louise-Schroeder-Gymnasium 📝</h1>
<h3 align="center"style="margin: 10px;">Full-Stack Repository for our School&nbsp;&nbsp;🚌</h3>
<p align="center" style="margin: 0; padding: 0;">
  <a href="COPYING"><img src="https://img.shields.io/github/license/3x071c/lsg" alt="GitHub license badge" /></a>
  <a href="https://github.com/3x071c/lsg/graphs/commit-activity"><img src="https://img.shields.io/github/commit-activity/m/3x071c/lsg" alt="GitHub commit activity badge" /></a>
  <a href="https://github.com/3x071c/lsg/graphs/commit-activity"><img src="https://img.shields.io/github/last-commit/3x071c/lsg" alt="GitHub last commit badge" /></a>
</p>
<hr style="height: 2px; margin: 5px;" />
<p align="center">
  <a href="#introduction">Introduction</a> •
  <a href="#get-started-">Get Started</a> •
  <a href="#recommendations-for-vscode">Recommendations</a> •
  <a href="#helpful-resources">Help</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#license">License</a>
</p>

> Looking for the old version using Next.js with an Apollo+Nexus GraphQL stack? It's gone now. ([archive](https://github.com/3x071c/lsg/tree/7c377cdef5baddd9dcf5f49985325081f31159e3))

## Introduction

👋 Hey!  
You're looking at the source code behind the new [Louise-Schroeder-Gymnasium website](https://lsg.musin.de/) right now! 🤯 It houses a full-stack [Remix](https://remix.run/) application, loaded with TypeScript, Prisma and [a bunch of other goodies](#tech-stack). It's not out yet, but we're working on it. Wanna help out? 😇 See how to [get started](#get-started-), take a look at the [tech stack](#tech-stack), or dig straight into the [documentation](#documentation). 👀

## Public Money, Public Code

[**Why is software created using taxpayer money, written for the public sector, existing solely to serve the public, not released in the public?**](https://www.fsf.org) Too often government spends a considerable amount of money on software which is outdated by the time it arrives, not maintained appropriately, contains serious bugs and/or ultimately can't be trusted to respect the security and privacy of the people who paid for it. That's why this project is licensed under the [**GNU Affero General Public License**](https://www.gnu.org/licenses/agpl-3.0.html). We believe that code written for the public sector should be free and open for the public to run, study, copy, change, distribute and improve. [**If it is public money, it should be public code as well.**](https://publiccode.eu) 💰

## Quickstart

Impatient? Spin up a GitPod environment in seconds and you're good to go:  
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/3x071c/lsg)

> Please provide feedback and take a look at [the guide](#get-started-) below if things break unexpectedly while following these steps carefully:
>
> 1. Click the button above to launch a [Visual Studio Code](https://code.visualstudio.com/) editor in your browser, without having to go through the setup below
> 2. GitPod will prompt you to sign in with your GitHub account (do that)
> 3. When the instance has started and VSCode opens in your browser, you will see a bunch of stuff going on in the Terminal (this is normal, don't freak out - your environment is being setup for you automatically using the commands that are detailed in the guide below)
> 4. There will probably be a couple pop-ups in the bottom right. Look for the one that asks if you want to install the recommended extensions for this project, and select "Install" (or similar). You can close the others.
> 5. While the extensions are being installed, you will be flooded with a bunch of tabs about them. These tabs can be closed with the "x" next to them in the VSCode tab bar at the top of the editor
> 6. Once the terminal commands have completed, you will see a green checkmark saying "[SERVER] ✅ http://localhost:3000" in the terminal
> 7. A preview of the app (at `localhost:3000`, a special internet address that goes directly to the webapp on GitPod) should open automatically in a "Simple Browser" tab (if it says "Port 3000 not found", hit "Try Again" after a couple seconds, and check if nothing has gone wrong in the terminal)
> 8. From here, you should be able to browse the code from the file tree in the panel on the left. Try editing a file (such as `app/routes/__pages/index.tsx`) by adding or removing some text and watch the browser preview reload automatically, reflecting the changes you just made.
> 9. Familiarize yourself with the [tech stack](#tech-stack), the [developer docs](#documentation), the [Contributing](#contributing) section and the guide below to get the most out of your coding session. If you don't know where to start, read the [Helpful Resources](#helpful-resources) recommendations.
> 10. You may want to reload the GitPod environment before starting to code for the first time using <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd> -> "Developer: Reload Window". If the keyboard shortcuts don't work, open the command palette manually by clicking the settings cogwheel in the bottom left corner, then selecting "Command Palette..."
> 11. You're ready to code and build something awesome. Have fun! 😎
>
> When you're done, just close the browser tab/window, and GitPod will terminate your VSCode instance within a few minutes automatically. You can reopen it, and any changes you haven't permanently saved by committing them to this repository yet, within 14 days from the [GitPod dashboard](https://gitpod.io/workspaces). Read on to learn more.

## Get Started 💨

> Prerequisites: You understand basic terminal commands, how to teach yourself from online resources and how to get around in a programming environment (Check the [helpful resources](#helpful-resources) section if you're not sure). You run a supported operating system (GNU+Linux, BSD, macOS, Windows) and have a package manager installed (No? [Install Homebrew on macOS](https://brew.sh) or [Install winget on Windows](https://docs.microsoft.com/en-us/windows/package-manager/winget/). GNU+Linux/BSD-based distributions commonly come with a package manager you should already be familiar with)

Open a terminal (you'll probably want to keep this around):

-   (GNU+Linux, BSD) <kbd>⊞ Win</kbd> (App Launcher) -> open `Terminal`/`Konsole`
-   (macOS) <kbd>⌘</kbd> + <kbd>Space</kbd> -> open `Terminal.app`
-   (Windows) <kbd>⊞ Win</kbd> + <kbd>R</kbd> -> `cmd` ([m](https://tinyurl.com/nuub2bq)[y](https://tinyurl.com/y2emej63)[ ](https://tinyurl.com/y2lzznux)[c](https://tinyurl.com/y3v8vo5a)[o](https://tinyurl.com/y4qcfkw3)[n](https://tinyurl.com/y5gm9ysv)[d](https://tinyurl.com/y69uplwl)[o](https://tinyurl.com/yygc57ta)[l](https://tinyurl.com/yynoa7ql)[e](https://tinyurl.com/y3shavwn)[n](https://tinyurl.com/yxladmrj)[c](https://tinyurl.com/y3yxymqr)[e](https://tinyurl.com/y2c6alo5)[s](https://tinyurl.com/y5qtqr6p))

Make sure you have the latest version of [Node.js](https://nodejs.org/) and NPM (the Node package manager, which should ship with it) installed:

-   (GNU+Linux, BSD) `$ pacman -S nodejs`
-   (macOS) `$ brew install node`
-   (Windows) `$ winget install -e --id OpenJS.NodeJS`

> (The package manager `pacman` is specific to the Arch GNU+Linux distribution. Always check your **distribution-specific** Debian/Fedora/Ubuntu/... documentation first, as commands may differ)

Make sure you have the latest version of [git](https://git-scm.com/) installed, which you will need to use to download our code, share your changes and collaborate with others ([GitHub](https://github.com) is the server provider that stores our code and interfaces with `git`):

-   (GNU+Linux, BSD) `$ pacman -S git`
-   (macOS) `$ brew install git`
-   (Windows) `$ winget install -e --id Git.Git`

> If you want to contribute code, you'll probably want to configure git to use your name and email, associating your contributions with your GitHub account:  
> `git config --global user.name "<your GitHub username>"`  
> `git config --global user.email "<your GitHub email>"`

Clone this repository with git (This will "download" the code and keep a special directory around (`.git`) to track your changes and make collaboration easier):

```console
$ cd ~/Folder/you/want/to/clone/this/repository/into
$ git clone https://github.com/3x071c/lsg.git
```

> Tip: Use <kbd>Tab</kbd> to complete terminal commands and show suggestions

Open the project in [Visual Studio Code](https://code.visualstudio.com/), our recommended IDE (code editor):

```console
$ code lsg
```

**Make sure to trust the folder and install all recommended extensions** (If you're new to Visual Studio Code, check out the [next section](#recommendations-for-vscode) as well). You can close the automatically opened tabs with the installed extensions.

> Installation instructions for Visual Studio Code:  
> (GNU+Linux, BSD) `pacman -S code` (limited OSS version) / `yay -S visual-studio-code-bin` (Research required!)  
> (macOS) `brew install --cask visual-studio-code`  
> (Windows) `winget install -e --id Microsoft.VisualStudioCode`

Install the dependencies of this project (you can open up a Terminal in VSCode with <kbd>Ctrl</kbd> + <kbd>J</kbd>):

```console
$ npm i
```

Now, you'll need to setup a PostgreSQL database. There are many ways you can get one up and running (ask the internet); we're going to focus on two "officially recommended" ones here:

---

1. Setup a local PostgreSQL database yourself

-   (GNU+Linux, BSD) `pacman -S postgresql`
-   (macOS) `brew install --cask postgres-unofficial`
-   (Windows) `winget install -e --id PostgreSQL.PostgreSQL`

> If you are on macOS, `postgres-unofficial` installs [Postgres.app](https://postgresapp.com), which provides a handy UI and sane defaults to get started with little friction (no need for command-line configuration!)

There are lots of tutorials available online on setting up a PostgreSQL database natively. You will need to make a database connection available at a certain port (commonly `5432`) of your local machine (`localhost`).

2. Have docker setup PostgreSQL for you

(You will need docker though)

-   (GNU+Linux, BSD) `pacman -S docker docker-compose`
-   (macOS) `brew install podman docker-compose; podman machine init; podman machine start; alias docker='podman'`
-   (Windows) ???

> Note: On macOS and Windows, `docker` (a "containerization" solution) does not run natively, but through some sort of VM that provides a GNU+Linux, BSD environment for docker. A common recommendation here is [Docker Desktop](https://www.docker.com/products/docker-desktop/) by the Docker team (a fine option), though note that it has a very user-restricting license which we can't endorse. [Podman](https://podman.io) is a better alternative if you're ok with [reading a little](https://podman.io/getting-started/installation). You can treat the `podman` command as a drop-in `docker` replacement, and even `alias` it (on UNIX-like systems, that is)

Make sure to install both docker (or a docker equivalent) AND `docker-compose` to proceed:

```console
$ npm run up
...
```

[Docker Compose](https://docs.docker.com/compose/) will orchestrate a PostgreSQL database from the included [docker-compose.yml](./docker-compose.yml) file for you!

**Side note**: If you're working a lot with the build system, having a working docker installation around is going to save you a lot of time, as Fly deploys docker containers!

> Use the connection string `postgresql://postgres:postgres@localhost:5432/postgres` to connect to the database (see the instructions on populating the `.env` file below)

---

Create a `.env` file, containing static key-value pairs for environment-specific configuration. The `.env.example` file serves as a good starting point. You'll need your **PostgreSQL connection string** from the previous step here, to tell the app (/prisma) where and how to connect to your database.

> To securely generate a random password on your computer:  
> (GNU+Linux, BSD/macOS) `openssl rand -base64 40`  
> (Windows) ??? (use [this](https://1password.com/password-generator/) instead)

The `MAGIC_*` variables hold the public and private (secret) API keys for [Magic](https://magic.link), our chosen authentication solution. During local development, **Magic** runs in [Test Mode](https://magic.link/docs/introduction/test-mode) - this allows you to use "**test+success@magic.link**" (or `test+fail@magic.link`) to simulate a real-world successful/failed login while bypassing the regular magic link authentication scheme. Consequently, the environment variables may be populated with "dummy" values for development. In production, values from the Magic admin dashboard are provided.

Run our setup script to fill your database with "seeded" sample records and generate code necessary for development:

```console
$ npm run new
```

Spin up a local development server. It will automatically reflect changes in the code:

```console
$ npm run dev
```

> You likely want to show debug messages using the following command instead: `npx cross-env DEBUG='*' npm run dev` If you want to view debug messages in the browser too, follow the instructions [here](https://github.com/debug-js/debug#browser-support) by executing the `localStorage` line in your browser's console (etc.)

Before you start working:

```console
$ git status # Check if everything's fine
$ git checkout trunk # Move to the default branch in case you aren't
$ git pull --all --rebase # Make sure you're up-to-date by "pulling" the latest changes
$ git checkout -b <build|chore|ci|docs|feat|fix|perf|refactor|revert|style|test>/<your idea> # Start off with a feature branch
$ # examples:
$ git checkout -b feat/add-cat-gifs
$ git checkout -b fix/zalgo-bug
$ git checkout -b chore/bump-deps
$ git checkout -b refactor/folder-structure
$ # ...
```

Commit changes in reasonable chunks regularly while working (make sure everything works before committing):

```console
$ npm run commit # Make sure to always commit using conventional commit messages if you commit with a different tool (see https://www.conventionalcommits.org/ for more info)
```

Push your changes to GitHub so others can follow your progress (you will need repository access):

```console
$ git push --prune -u origin HEAD # Authenticate with your GitHub credentials (See here for how to save them: https://git-scm.com/book/en/v2/Git-Tools-Credential-Storage)
```

Open a `draft` pull request (PR) on GitHub from your branch to the default branch (trunk) and watch the status checks complete. The title of the PR should follow the [same format](https://www.conventionalcommits.org/) as your commits, the body should include all necessary information for others to understand what the branch changes. [Fly](https://fly.io/) (and a bunch of scripts) will build a live preview of your PR! (Each deployment usually takes around 7 minutes)

Once your branch is ready to be published, convert the draft PR into a regular one, and `kodiak` (a bot) will automatically take care of "squashing" your changes into a single commit onto the default branch. Make sure to familiarize yourself with the [Contributing](./CONTRIBUTING.md) guide, and request reviews from others (using the sidebar) when appropriate, before "un-drafting" your PR.

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
-   [GitLens - Git supercharged](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens)
-   [Import Cost](https://marketplace.visualstudio.com/items?itemName=wix.vscode-import-cost)
-   [NPM Version Lens](https://marketplace.visualstudio.com/items?itemName=pflannery.vscode-versionlens)
-   [Visual Studio IntelliCode](https://marketplace.visualstudio.com/items?itemName=VisualStudioExptTeam.vscodeintellicode)

That's it, you're good to go! 🤩

## Helpful Resources

Here are some pointers to completely free, yet incredibly valuable learning resources if you've just started dipping your toes into web development in general, or are new to React, TypeScript, etc:

-   [Brian Will](https://www.youtube.com/watch?v=vjtywpx2SDY&list=PL7141DE955793D3F0) published a playlist of videos teaching fundamental Programming Language principles
-   [w3schools](https://www.w3schools.com/whatis/) targets newcomers to web development, approaching web development fundamentals in a simplified way
-   [FreeCodeCamp](https://www.youtube.com/c/Freecodecamp/videos) hosts long video sessions, going through the entire web and software development process
-   The [MDN Developer Web Development](https://developer.mozilla.org/en-US/docs/Learn) series provides a great starting point for both beginners and advanced developers (re-)exploring HTML, CSS and JavaScript
-   The [Re-Introduction to JS](https://developer.mozilla.org/en-US/docs/Web/JavaScript/A_re-introduction_to_JavaScript) by MDN, if you already know "old-school" JavaScript, specifically focuses on more recent changes to the JavaScript landscape that have shaped the language, the ecosystem and this project, refreshing knowledge and bringing you up to speed with the latest developments
-   [Traversy Media](https://www.youtube.com/c/TraversyMedia/videos) provides long videos showing the development with and integration of JavaScript stacks and projects
-   Even though this project uses **Remix and NOT Next.js** (we used to, sometime ago), the [Next.js learning website](https://nextjs.org/learn) is a very well illustrated take on React and React framework familiarization. A lot of concepts in Next.js can be transferred to Remix, so don't hesitate learning them.
-   The [React website](https://reactjs.org) itself has a getting started guide and a full tutorial, as well as an overview, about React and advanced JavaScript development
-   [Fireship](https://www.youtube.com/c/Fireship/videos) does videos on the JavaScript landscape, with entertaining shorts and longer explorations
-   If you're familiar with old JavaScript stacks and libraries, such as Knockout, Handlebars or MVC frameworks, then the official [Introduction to React.js](https://www.youtube.com/watch?v=XxVg_s8xAms), or (the more entertaining) [Rethinking best practices](https://www.youtube.com/watch?v=x7cQ3mrcKaY) talk by a React maintainer at Facebook, both from 2013 may be helpful (note that nowadays, React components have improved to mainly use functions instead of classes)
-   [Ben Awad](https://www.youtube.com/c/BenAwad97/videos) makes comedic videos on TypeScript, React, related technologies and decision-making in one of the largest programming language ecosystems
-   Understanding the [event loop (YouTube)](https://www.youtube.com/watch?v=8aGhZQkoFbQ) isn't necessary, but definitely helpful to understanding modern JavaScript performance and user experience optimization
-   [Google's web.dev](https://web.dev/learn/) showcases advanced concepts and guides to intermediate developers
-   The [Visual Studio Code YouTube channel](https://www.youtube.com/c/Code/videos) contains informative shorts on tips & tricks to optimize productivity with VSCode
-   The [Remix YouTube channel](https://www.youtube.com/c/Remix-Run/videos) and [Chakra UI YouTube channel](https://www.youtube.com/channel/UC4TmDovH46TB4S0SM0Y4CIg) provide an audiovisual alternative to learn more about these dependencies
-   [Luke Smith](https://www.youtube.com/c/LukeSmithxyz/featured) has some videos focusing on UNIX principles, educating about the usefulness of command-line utilities on operating systems such as macOS and GNU/GNU+Linux, BSD

Want to contribute a helpful resource for others to learn from? Open an issue!

## Documentation

See [Docs](DOCS.md)

## Contributing

See [Contributing](CONTRIBUTING.md)

## Tech Stack

-   [Git](https://git-scm.com/) - Version Control
-   [Editorconfig](https://editorconfig.org/) - IDE file style consistency
-   [Prettier](https://prettier.io/) - Code formatting
-   [ESLint](https://eslint.org/) - JavaScript linting
-   [CSpell](https://github.com/streetsidesoftware/cspell) - Spell checker
-   [SecretLint](https://github.com/secretlint/secretlint) - Prevent secret leakage
-   [jscpd](https://github.com/kucherenko/jscpd) - Copy/paste detector
-   [Commitlint](https://commitlint.js.org/) - [Conventional Commit](https://www.conventionalcommits.org/) Validator
-   [Commitizen](http://commitizen.github.io/cz-cli/) - [Conventional Commit](https://www.conventionalcommits.org/) Prompt
-   [GitHub Actions](https://github.com/features/actions) - Continuous Integration
-   [NodeJS](https://nodejs.org/en/) - Server-Side JavaScript
-   [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript superset/compiler
-   [React](https://reactjs.org/) - Declarative, component-based, reactive UI library
-   [Remix](https://remix.run/) - SSR React Framework using [React-Router](https://reactrouter.com/)
-   [Chakra UI](https://chakra-ui.com) - React component framework
-   [Emotion](https://emotion.sh) - CSS-in-JS library used by Chakra UI
-   [Lodash](https://lodash.com) - Utility functions
-   [Prisma](https://www.prisma.io) - Database ORM
-   [Fly](https://fly.io) - Continuous Deployment

## License

This project is licensed under the GNU Affero General Public License (`GNU AGPL 3.0 or later`).<br /> It is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more details. A copy of the GNU Affero General Public License Version 3 should be distributed along with this program [here](COPYING). If not, see [the official GNU license website](https://www.gnu.org/licenses/).
