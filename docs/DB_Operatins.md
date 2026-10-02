# How to modify the PSQL database in production.

1. Modify the `./src/db/schema.ts` file to the schema you want in prod.
2. Generate the migrations required to meet the new schema `npx drizzle-kit generate`
3. Stage and commit the migrations and schema changes.
4. The migrations will be ran before the branch is deployed.

# Viewing db schema as diagram
1. Install `dbdiagram` vscode extension
2. Run command **f1** `DBML Generate DBML from database connection`
3. Select Postgres
4. Pass in local database connection for a db that already has the schema deployed
5. Enter file name for generated diagram
6. Open generated `*.dbml` file
7. Select icon in top right to view as diagram


## Other

- For a db viewer `pnpm drizzle-kit studio`