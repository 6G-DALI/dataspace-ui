# 6G-DALI Metadata Catalogue UI

A piveau-based metadata catalogue web application, customised for 6G-DALI. It is a
single-page app that browses and searches datasets and catalogues exposed by a
piveau Hub backend, and is designed to be **re-branded and re-themed at runtime**
(logo, title, and colours) without rebuilding the image — so the same Docker image
can be deployed under different brands by changing environment variables.

## What the app does

- **Browse & search** catalogues and datasets served by a piveau Hub search backend.
- **Catalogue list** rendered as responsive cards (1 / 2 / 3 per row by screen size),
  with non-`staging` catalogues sorted to the top and a default sort of
  **Name, ascending**.
- **Dataset details** including distributions, quality metrics, and SPARQL access.
- **Runtime branding & theming** of the logo, browser tab title, and colour palette
  via `VITE_*` environment variables (see [Branding & theming](#branding--theming)).

## Stack

- Vue.js 3 (SPA, `<script setup>`)
- TailwindCSS 4 (CSS-variable token theming)
- TypeScript
- piveau.kit
- Histoire (component stories)

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
- `logoUrl`: header/footer logo (URL or web-root path)
- `appTitle`: browser tab title
- `projectTitle`, `projectUrl`: project name and link shown in the UI
- `themeColors`: JSON string of colour overrides; parsed at runtime by
  `useRuntimeTheme` (see [Branding & theming](#branding--theming))


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

**Branding & theming** (see [Branding & theming](#branding--theming) for details)

- `VITE_LOGO_URL` – header/footer logo (URL or web-root path; default `/sparkworks-white.png`)
- `VITE_APP_TITLE` – browser tab title (default `piveau - Metadata Catalogue`)
- `VITE_PROJECT_TITLE` – project name shown in the UI
- `VITE_PROJECT_URL` – project link
- `VITE_THEME_COLORS` – JSON object of colour overrides (empty = built-in palette)
- `VITE_SOCIAL_*`, `VITE_CONTACT_EMAIL` – footer social links and contact address


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

## Branding & theming

The logo, browser tab title, and colour palette are all driven by `VITE_*`
environment variables and applied **at runtime**, so a single built image can be
re-branded per deployment.

### Logo & title

- `VITE_LOGO_URL` – the image used in the header and footer. Use a full URL or a
  path served from the web root (e.g. `/my-logo.png`).
- `VITE_APP_TITLE` – the browser tab title. The title in `index.html` is static
  (not touched by the container's `envsubst`), so it is applied at runtime in
  `App.vue` via `useTitle(appConfig.appTitle)`.
- `VITE_PROJECT_TITLE` / `VITE_PROJECT_URL` – project name and link shown in the UI.

### Colours (`VITE_THEME_COLORS`)

`VITE_THEME_COLORS` is a **single JSON object** holding all colour overrides. Any
key you omit falls back to the built-in palette, so you only need to specify what
you want to change. An **empty** value keeps the default theme entirely.

Supported keys and the CSS variable each maps to:

| Key | Maps to | Default |
|---|---|---|
| `primary` | `--piveau-primary` | `#343a41` |
| `primaryHover` | `--piveau-primary-variant` | `#202272` |
| `secondary` | `--piveau-secondary` | `#f9a01b` |
| `secondaryHover` | `--piveau-secondary-variant` | `#e08a00` |
| `headerBg` | `--piveau-header-bg` | `#343a41` |
| `headerText` | `--piveau-header-text` | `#ffffff` |
| `footerBg` | `--piveau-footer-bg` | `#343a41` |
| `footerText` | `--piveau-footer-text` | `#ffffff` |

**Default palette** (equivalent to leaving `VITE_THEME_COLORS` empty):

```json
{"primary":"#343a41","primaryHover":"#202272","secondary":"#f9a01b","secondaryHover":"#e08a00","headerBg":"#343a41","headerText":"#ffffff","footerBg":"#343a41","footerText":"#ffffff"}
```

**6G-DALI theme:**

```json
{"primary":"#003580","primaryHover":"#002a66","secondary":"#0274be","secondaryHover":"#015f9c","headerBg":"#0a1628","headerText":"#ffffff","footerBg":"#0a1628","footerText":"#ffffff"}
```

### How theming works

On startup `App.vue` calls `useRuntimeTheme()`
(`src/composables/useRuntimeTheme.ts`), which:

1. Reads `appConfig.themeColors` (the parsed `VITE_THEME_COLORS` value).
2. Parses the JSON (invalid JSON is ignored with a console warning, so a bad value
   never breaks rendering).
3. Maps each key to its `--piveau-*` source variable and injects a
   `<style id="runtime-theme">:root { … }</style>` block into `<head>`.

Because the overrides target the `--piveau-*` **source** variables, they cascade
through the token layer (`--primary`, `--secondary`, `--header-bg`, …) defined in
`src/assets/tailwind.css` to every Tailwind utility and component that consumes
them. Injecting via a stylesheet (rather than inline styles on the root element)
preserves normal specificity, so the dark-mode `:root[data-theme="dark"]`
overrides still win.

### Setting the values

> ⚠️ **Quoting matters for `VITE_THEME_COLORS`** because the value contains `{`,
> `"`, and `#` characters.

**Local development** — put it in a `.env` (or `.env.dev`) file at the repo root
and **single-quote the whole value** (otherwise dotenv treats the `#` hex colours
as a comment and truncates the JSON). Restart `pnpm dev` afterwards — Vite only
reads env at startup.

```dotenv
VITE_LOGO_URL=/my-logo.png
VITE_APP_TITLE=6G-DALI Metadata Catalogue
VITE_THEME_COLORS='{"primary":"#003580","secondary":"#0274be","headerBg":"#0a1628"}'
```

**Docker Compose** — use the **map form** so YAML strips the quotes and the
container receives clean JSON. Do **not** wrap the value in shell-style quotes in
the list form (`- KEY='...'`), or the quotes become part of the value and JSON
parsing fails:

```yaml
services:
  vanilla:
    environment:
      VITE_LOGO_URL: /my-logo.png
      VITE_APP_TITLE: 6G-DALI Metadata Catalogue
      VITE_THEME_COLORS: '{"primary":"#003580","secondary":"#0274be","headerBg":"#0a1628"}'
```

Recreate the container after changing env (`docker compose up -d`) — a plain
restart reuses the old environment.

### Troubleshooting

- **No colour change at all:** open DevTools → `<head>` and check for
  `<style id="runtime-theme">`. If it's missing, `VITE_THEME_COLORS` is arriving
  empty.
- **Console warns `VITE_THEME_COLORS is not valid JSON; ignoring`:** the value is
  malformed — usually stray surrounding quotes (Docker Compose list form) or a
  `#`-truncated value (unquoted in a `.env` file). See the quoting notes above.
- New `VITE_*` variables must also be declared in `config/default.env` so they are
  whitelisted for the container's `envsubst` step.

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
