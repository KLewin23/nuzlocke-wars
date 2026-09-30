# How to modify the PSQL database in production.

1. Modify the `./src/db/schema.ts` file to the schema you want in prod.
2. Generate the migrations required to meet the new schema `npx drizzle-kit generate`
3. Stage and commit the migrations and schema changes.
4. The migrations will be ran before the branch is deployed.

## Other

- For a db viewer `pnpm drizzle-kit studio`