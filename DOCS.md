# Developer Documentation

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
