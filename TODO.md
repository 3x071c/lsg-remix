# To do

## Short term

-   Add custom error pages ([docs](https://nextjs.org/docs/advanced-features/custom-error-page))
-   Redirect from `$lib/auth` to a 500 error page instead of a 404
-   Enable type checking (remove `package.json`->`scripts`->`check` escape hatch) again ([blocked](https://github.com/chakra-ui/chakra-ui/issues/5317))
-   Increment `engines->node` in `package.json` to 16 (LTS) ([blocked](https://github.com/vercel/community/discussions/37))

## Mid term

-   Add the PageHistory model back ([last state of the repository with PageHistory model](https://github.com/3x071c/lsg-stack/tree/ecb7b7bff76d4b19d86dc58fae8d39f9a3f9ea98))
-   Add [Cypress](https://cypress.io/) testing (shortly before hitting production)

## Long term

-   Separate concerns into [turborepo](https://turborepo.org/)
