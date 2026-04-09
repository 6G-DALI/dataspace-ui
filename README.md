# New Vanilla

The new Vanilla is a boilerplate to help developers create data portals based on piveau quickly.

## Overview

- Vue.js (SPA)
- TailwindCSS 4
- TypeScript
- piveau.kit
- Histoire

## Project Setup

Requirements:
- Node.js >= 24; see [.nvmrc](.nvmrc)
- pnpm >= 10; see [package.json](package.json)

### Clone repository

```sh
git clone https://gitlab.com/piveau/ui/vanilla.git
```

### pnpm

This project uses pnpm as package manager. If you don't have pnpm installed, you can install it using the following command:

```sh
npm install --global corepack@latest
corepack enable pnpm@10
```

### Install dependencies

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production with Piveau Vue components

```sh
pnpm build
```

### Preview components in Histoire

```sh
pnpm story:dev
```

## Configuration

This project centralizes its runtime settings in `config/appConfig.ts`.

- **Development (`pnpm dev`)** uses `config/config.dev.js`.
  - Values are read from `import.meta.env` (Vite env) with a few fallbacks.
  - Provide variables via `.env`, `.env.dev`, or your shell environment.
- **Production build (`pnpm build`)** uses `config/config.js`.
  - The file contains *string placeholders* like `$VITE_AUTHENTICATION_KEYCLOAK_URL`.
  - In the Docker image these placeholders are replaced at container startup by
    `runtimeconfig.sh` using `envsubst`.

### Configuration keys (appConfig)

`config/appConfig.ts` exposes these fields:

- `appUrl`: public URL of the application (used e.g. as Keycloak redirect target)
- `keycloakUrl`, `keycloakRealm`, `keycloakClientId`: Keycloak connection settings
- `supersetUrl`: optional external analytics URL of superset
- `piveauHubSearchUrl`, `piveauHubRepoUrl`, `piveauHubStoreUrl`: piveau Hub endpoints
- `piveauSparqlUrl`: SPARQL endpoint
- `piveauDataQualityUrl`: The metrics cache endpoint. Leaving this field blank will disable the metric details UI.


### Environment variables

The runtime configuration is primarily controlled via `VITE_*` environment variables.
The Docker image also ships `config/default.env` as a set of defaults.

**Common / required in most deployments**

- `VITE_API_BASE_URL` – base URL of the portal (used as `appUrl` in production builds)
- `VITE_AUTHENTICATION_KEYCLOAK_URL` – Keycloak base URL (e.g. `https://sso.example.org`)
- `VITE_AUTHENTICATION_KEYCLOAK_REALM` – realm name
- `VITE_AUTHENTICATION_KEYCLOAK_CLIENT_ID` – client id (default in `default.env`: `piveau-hub-ui`)
- `VITE_API_HUB_SEARCH_URL` – hub search API (default: `https://demo.piveau.io/api/hub/search`)
- `VITE_API_HUB_REPO_URL` – hub repo API (default: `https://demo.piveau.io/api/hub/repo`)
- `VITE_API_HUB_STORE_URL` – hub store API (default: `https://demo.piveau.io/api/hub/store`)
- `VITE_API_SPARQL_URL` – SPARQL endpoint (default: `https://demo.piveau.io/api/sparql`)
- `VITE_API_DATA_QUALITY_URL` – data quality cache endpoint (default: `https://demo.piveau.io/api/metrics/cache/`). Leaving this blank will disable the metric details UI.

**Optional**

- `VITE_SUPERSET_URL` – Superset URL
- `VITE_API_MIDDLEWARE_URL` – middleware API URL to define the base endpoint for the Piveau Auth Middleware


### Local development example

Create a `.env.dev` file in the repository root:

```dotenv
VITE_AUTHENTICATION_KEYCLOAK_URL=https://sso.example.org
VITE_AUTHENTICATION_KEYCLOAK_REALM=example
VITE_AUTHENTICATION_KEYCLOAK_CLIENT_ID=piveau-hub-ui

VITE_API_HUB_SEARCH_URL=https://demo.piveau.io/api/hub/search/
VITE_API_HUB_REPO_URL=https://demo.piveau.io/api/hub/repo/
VITE_API_HUB_STORE_URL=https://demo.piveau.io/api/hub/store/
VITE_API_SPARQL_URL=https://demo.piveau.io/api/sparql
VITE_API_DATA_QUALITY_URL=https://demo.piveau.io/api/metrics/cache/
```

Then run:

```sh
pnpm dev
```

### Docker / runtime config substitution

In the container, `runtimeconfig.sh`:

1. Loads defaults from `/default.env`.
2. Collects all environment variables starting with `VITE_`.
3. Rewrites the built `assets/index-*.js` bundle by replacing placeholders from
   `config/config.js` with the actual environment values.

This enables changing endpoints **without rebuilding** the frontend image.

## CI/CD Pipeline

The project uses GitLab CI/CD with the following stages:

### Build Stage
- **build-asset**: Builds the frontend assets
    - Uses Node.js 18 Alpine image
    - Utilizes PNPM for package management
    - Caches dependencies for faster builds
    - Produces distribution artifacts in `dist/` directory

- **build-and-push**: Creates and pushes Docker images
    - Builds Docker image using the latest artifacts
    - Pushes two tags to the registry:
        - Latest commit SHA (`$CI_REGISTRY_IMAGE:$CI_COMMIT_SHA`)
        - Latest version (`$CI_REGISTRY_IMAGE:latest`)

### Deploy Stage
- **deploy**: Deploys to OpenShift
    - imports the latest Docker image
    - deploys to OpenShift

### Notes
- Pipeline runs on `fokus-runner` tags
- Master branch deployments only
- Caching strategy uses pull-push policy for node_modules and PNPM store
