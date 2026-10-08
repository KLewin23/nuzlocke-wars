<div align="center">
  <!-- <a href="https://nuzlocke-wars.com"> -->
    <img alt="Nuzlocke Wars!" src="docs/images/icon.png" height="200" />
  <!-- </a> -->
    <h1>Nuzlocke Wars!<h1>
</div>

# Requirements
- Node JS version 24.21.0 (Use [nvm](https://github.com/nvm-sh/nvm))
- Docker
- Tested on Linux (probably works on OSX as well)
- [direnv](https://direnv.net/) for managing environment variables



# Setup

## Required Environment Variables
- DATABASE_USERNAME
- DATABASE_PASSWORD
- DATABASE_NAME
- DATABASE_PORT
- DATABASE_HOST
- DATABASE_URL
- BETTER_AUTH_SECRET - generate with `openssl rand -base64 32`
- BETTER_AUTH_URL

## Commands
1. `pnpm install`
2. `docker compose up -d`
3. `pnpm dev`

