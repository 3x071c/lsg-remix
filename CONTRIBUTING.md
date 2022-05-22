# Contributing

## Trunk-based development

This repository follows the guidelines of [Trunk based development](https://trunkbaseddevelopment.com/), using the 'scalable' approach of branching off and merging (actually, squashing) into `trunk` using pull requests. Remember that this part is automated by `kodiak` (bot).

## Git Usage

> Git is a distributed version control system. As a result of its nature, the _remote_ (online repository hosted on GitHub, often called `origin` (check `git remote -v` to see the name of your remote)) and your local repository are treated separately, may diverge, not stay in sync, get out of date etc. [Click here for a great tutorial](https://www.atlassian.com/git/tutorials/setting-up-a-repository) on the basics of git collaboration.

Squashing and rebasing over merging is encouraged. PRs can only be squashed onto trunk (linear git history is enforced). Here is a reference for some common git operations:

-   `git status` - Information about your local git status
-   `git checkout -b <name>` - Create a new branch off of the current one and switch to it (always create a separate branch before working)
-   `git pull --all --rebase` - Downloads remote changes
-   `git push --prune -u origin HEAD` - Uploads changes on your branch
-   `git checkout <name>` - Switch the current branch (f.e. back to trunk)
-   `git remote prune origin` - Delete local branches without a remote equivalent (run this every once in a while to clean up)
-   `git stash save -u <name>` - Store local changes away for later
-   `git stash list` - Lists all your stashes
-   `git stash pop stash@{<identifier>}` - Apply stash with identifier (from `git stash list`)

## Conventional Commits

**All** commits have to adhere to the [Conventional Commit](https://www.conventionalcommits.org/) specification, using the [Conventional Changelog](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional) types (f.e. `feat: add cat gifs`). Branches should also follow this schema, using a slash (`/`) to separate the type and branch purpose (f.e. `feat/add-cat-gifs`). PR titles must also match the conventional commit message that will be used when the PR is squashed into the default branch. PR bodies should contain a description of the changes.

## Issues and Discussions

Issues are exclusively for feature requests and bug fixes; support and vague ideas should be posted in the dedicated GitHub discussions tab.
