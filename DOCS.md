# Developer Documentation

## GraphQL and TypeScript

If you've just edited some GraphQL-related code, there's a high chance TypeScript (and type-related ESLint rules) will start complaining about some weird type incompatibility. This is because a lot of the tools used here (Apollo Client's Query type-checking, Nexus types for its schema, Prisma's types for the database) require some command to run in the background to regenerate its types when the code changes. Here's a simplified rundown of what to do, depending on the part of the app that was changed:

-   On the client-side (Apollo Client): `pnpm apollo:watch`
-   In the schema folder (Nexus): `pnpm nexus:watch` (Doesn't appear to do anything right now -> just run the dev server `pnpm dev` in the background)
-   In the `schema.prisma` file (Prisma): `pnpm prisma:watch`
-   **Regenerate everything**: `pnpm generate` (once) / `pnpm watch` (until killed)

It is recommended to always have the dev server (`pnpm dev`) as well as `pnpm watch` running in the background. TypeScript errors might seem frustratingly complex at first - try identifying the root cause from the message. Another thing worth noting is that often, the VSCode extensions for TypeScript and ESLint will not catch up with the local type changes and continue reporting errors. Instead of restarting the editor, restarting the `ESLint Language Server` from the VSCode Command Palette (<kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>P</kbd>) should do it (you might also have to restart the TypeScript server from the command palette).

## Folder Structure

-   Top-level folders separate concerns (`db/` contains data, `src/` contains application source code)
-   `db/`:
    -   Contains SQLite3 database files
-   `$src/`:
    -   Contains entire source code
    -   `$app/`:
        -   Contains app source code (**frontend**)
        -   Inspired by the [Redux recommended folder structure](https://redux.js.org/faq/code-structure#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go)
        -   Feature-folder style: sub-folders contain files all belonging to the same **feature** -> Nesting feature-folders is possible, i.e. when one feature inherently depends on a parent feature existing
        -   Generic helper scripts/files can be put directly inside the folder
    -   `$graphql/`:
        -   Contains [GraphQL](https://graphql.org/) related code
        -   GraphQL is a query specification for APIs (similar to how you would use patterns like REST)
        -   [Apollo](https://www.apollographql.com/) implementation for client and server
        -   Instead of GraphQL SDL: [Nexus](https://nexusjs.org/) to write declarative schemas and resolvers in the same files
        -   [Prisma](https://www.prisma.io/) as an ORM to connect to the database from the Nexus resolvers
    -   `$lib/`:
        -   Contains generic/helper files (**backend**)
    -   `$pages/`:
        -   Contains the front-facing [NextJS](https://nextjs.org/) app, referencing components from `$app/`
