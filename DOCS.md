# Developer Documentation

## Folder Structure

-   Top-level folders separate concerns
-   `db/`:
    -   Contains database-related files
    -   Database schema (Prisma)
    -   Database seeding instructions (Prisma)
-   `$app/`:
    -   Contains app source code (**frontend**)
    -   Inspired by the [Redux recommended folder structure](https://redux.js.org/faq/code-structure#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go)
    -   Feature-folder style: sub-folders contain files all belonging to the same **feature** -> Nesting feature-folders is possible, i.e. when one feature inherently depends on a parent feature existing
    -   Generic helper scripts/files can be put directly inside the folder
    -   `$routes/`:
        -   Contains the front-facing [Remix](https://remix.run/) pages, referencing components from `$app/`
-   `$lib/`:
    -   Contains generic/helper files (**backend**)
