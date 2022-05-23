# Developer Documentation

## Folder Structure

-   Top-level folders separate concerns
-   `~app/`:
    -   Contains app source code
    -   Inspired by the [Redux recommended folder structure](https://redux.js.org/faq/code-structure#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go)
    -   `entry.client.tsx`/`entry.server.tsx`:
        -   Entry points on the server/client side - This is where React first takes control of the DOM, and initial scripts run
        -   Allows for running custom code before React renders the DOM
    -   `root.tsx`:
        -   This is the "root layout" and the direct child of both entry points
        -   Other layouts and pages are then rendered into its `Outlet`
        -   Here's where global React logic goes (such as style caching, loading global data, etc.)
    -   `server.ts`:
        -   Remix is configured to not run via its built-in app server, but with a custom [express](https://expressjs.com) configuration defined in this file
        -   Express is a very mature (good old) server library that provides convenient helpers and, most importantly, is endorsed by Remix to be used with Fly deployments in their [example](https://github.com/remix-run/blues-stack)
        -   Mostly ripped from said example
        -   Allows for fine-grained routing and inspection of individual requests if ever desired (for example, to check certain headers, or do some magic with Fly regions)
    -   `~assets/`:
        -   Makes it more convenient to import assets
        -   Put your static(!) assets here (media, images, etc) - They will be copied to `/public/build` when deployed and served over a faster CDN network with aggressive caching
    -   `~colormode/`:
        -   Contains helper components, functions etc. to deal with the challenge of rendering light/dark mode per user preference correctly on the server-side, syncing across tabs, switching automatically as time passes, etc.
        -   Imported in top-level entry files, but not really needed in nested routes or components -> not a good fit for the `features/` folder
    -   `features/` (`~feat/`):
        -   Feature-folder style: sub-folders contain files all belonging to the same **feature** -> Nesting is encouraged for parent-client feature relationships
    -   `~lib/`:
        -   Contains general utility functions
    -   `~models/`:
        -   Imports and enhances the automatically generated [zod-prisma](https://github.com/CarterGrimmeisen/zod-prisma) type definitions for all Prisma models (/database tables)
        -   These should ALWAYS be used whenever possible to validate untrusted user input BEFORE running sensitive code
    -   `~routes/`:
        -   Contains the front-facing [Remix](https://remix.run/) pages, referencing features from `~from/`
-   `db/`:
    -   Contains database-related files
    -   `data/`: This is used by the seed script, not interesting
    -   `migrations/`: This folder is managed by Prisma. DO NOT TOUCH ALREADY COMMITTED MIGRATIONS.
    -   `zod/`: Contains automatically generated type definitions for every Prisma model using [zod-prisma](https://github.com/CarterGrimmeisen/zod-prisma) -> see `~models/` for in-app usage
    -   `schema.prisma`: Database schema (For [prisma](https://www.prisma.io), a JavaScript ORM that makes it fairly easy and type-safe to query the database with JS/without SQL)
    -   `seed.ts`: Database seeding instructions ("seeding": Feeding a local database with example garbage data for development/testing)
-   `public/`:
    -   Contains static files (assets, media, images, etc.) that are served directly from the CDN and are cached aggressively
    -   Put your assets in `~assets/` instead for more convenient importing/usage
-   `types/`:
    -   Contains global TypeScript type definitions and utilities (these are all eradicated during compilation)

## (Code) Style

After getting the gist of how [Chakra UI](https://chakra-ui.com) works, it might seem enticing to pass a bunch of custom style properties and hooks into generic components (such as `Box` or `Flex`). **This is a bad practice!** Try using as little custom props, hooks, logic etc. as possible and instead building on semantically correct html tags (such as `Image`, `Popover`, `Wrapper`, `VStack` etc.), which most often already have sane default styling.

### Less is More

Keeping code readable is a top priority for future maintainability and elegance. **It is easy to churn out hundreds of lines of code** in a day, it's hard to achieve the same in a fraction of the size (leading to better performane and readability). Most props and function arguments have usable defaults and should not be set explicitly.

### Order

Props should be ordered by importance and "distance" from the core component (`p` > `m` > `box-shadow` > `font-weight`).

## Linting rules >:(

ESLint is setup to report and prevent bad code from finding its way into the codebase. In most cases, if the linter complains, **You're the problem**, not the linting rule. **Ignoring is not a solution**. Asserting is a solution. (Safe) Casting is a solution. Conditions are a solution. **Google is a solution**.

## RTFM

Self-explanatory.
