# Developer Documentation

## Folder Structure

-   Top-level folders separate concerns
-   `db/`:
    -   Contains database-related files
    -   Database schema (Prisma)
    -   Database seeding instructions (Prisma)
-   `$app/`:
    -   Contains app source code
    -   Inspired by the [Redux recommended folder structure](https://redux.js.org/faq/code-structure#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go)
    -   Feature-folder style: sub-folders contain files all belonging to the same **feature** -> Nesting is encouraged for parent-client feature relationships, i.e. the parent imports children from its own feature folder exclusively
    -   Generic helper scripts/files can be put directly inside the folder (discouraged, try finding a fitting feature)
    -   `entry.client.tsx`/`entry.server.tsx`:
        -   Entry points on the server/client side - This is where React first takes control of the DOM, and initial scripts run
        -   Allows for running custom code before React renders the DOM
    -   `root.tsx`:
        -   This is the "root layout" and the direct child of both entry points
        -   Other layouts and pages are then rendered into its `Outlet`
        -   Here's where global React logic goes (such as style caching, loading global data, etc.)
    -   `$routes/`:
        -   Contains the front-facing [Remix](https://remix.run/) pages, referencing components from `$app/`

## (Code) Style

After getting the gist of how [Chakra UI](https://chakra-ui.com) works, it might seem enticing to pass a bunch of custom style properties and hooks into generic components (such as `Box` or `Flex`). **This is a bad practice!** Try using as little custom props, hooks, logic etc. as possible and instead building on semantically correct html tags (such as `Image`, `Popover`, `Wrapper`, `VStack` etc.), which most often already have sane default styling.

### Less is More

Keeping code readable is a top priority for future maintainability and elegance. **It is easy to churn out hundreds of lines of code** in a day, it's hard to achieve the same in a fraction of the size (leading to better performane and readability). Most props and function arguments have usable defaults and should not be set explicitly unless you truly know better! Additionally, relatively new CSS features such as `Flex` may have compatability issues in the client's browser. In the interest of supporting as many devices as possible, refrain from using such features unless there's a specific need for it that can't be accomplished with "old-school" CSS (For example, instead of abusing `HStack`, passing `width: 100%` to children works just as well in many cases).

### Order

Props should be ordered by importance and "distance" from the core component (`p` > `m` > `box-shadow` > `font-weight`).

## On Checks

ESLint is setup to report and prevent bad code from finding its way into the codebase. In most cases, if the linter complains, **You're the problem**, not the linting rule. **Ignoring is not a solution**. Asserting is a solution. Casting is a solution. Conditions are a solution. **Google is a solution**.

## RTFM

Taking a look at the [Tech Stack](./README.md#tech-stack) might seem overwhelming at first, but after digging deeper the interconnected knowledge they share makes it indispensible to know what you're dealing with. If you don't understand something, **Read The F\*\*\*ing Manual**.

## Learning by Example

This repository already includes a lot of good usage examples for the libraries at play. **Don't reinvent the wheel**. Encapsulate and reuse instead.
