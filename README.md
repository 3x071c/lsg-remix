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

Generate types and seed database:

```{sh}
pnpm new
```

Start a local development server:

```{sh}
pnpm dev
```

Open the project in **Visual Studio Code**, trust the project and install all recommended extensions.

Happy hacking! 🥳

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
