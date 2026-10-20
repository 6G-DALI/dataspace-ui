# 6G-DALI Data Space — catalogue UI

The public catalogue of the 6G-DALI data space: testbed datasets, ML models and
data services, read from piveau. It replaces the piveau Vue UI that this
repository held before (in the git history).

It is built like the other 6G-DALI front ends — React 18 + Vite + TypeScript,
Bootstrap 5 + AdminLTE 4, and the shared shell and theme from
[`common-ui`](https://github.com/6G-DALI/common-ui) (`@6g-dali/ui-shell`,
`@6g-dali/ui-theme`) — so it looks and behaves like `dataops-ui` and
`portal-ui`: same navbar with the tool links, sidebar, breadcrumbs, light and
dark themes, runtime `config.js`.

## Pages

All pages are public. Signing in is optional.

| Route | Page |
|---|---|
| `#/` | Home: search box, counts (records, catalogues, ML models, data services), catalogues, recently updated records |
| `#/catalogues` | Every catalogue, with logo, record count, visibility; filterable |
| `#/catalogues/:id` | One catalogue: publisher, visibility, and a faceted search of its records |
| `#/datasets` | Faceted search across all catalogues (catalogue, theme, keyword, format, publisher, licence, country, access rights), sort, paging |
| `#/datasets/:id` | One record: description, distributions (download/access, connector asset, variables, **data-quality results**), service details, MLDCAT-AP model details, the 6G-DALI profile terms (GAIA-X, GDPR/FAIR, testbed context), links to the RDF |
| `#/models`, `#/services` | The models and services catalogues (`modelsCatalogue`, `servicesCatalogue`) |

Search state is in the URL (`#/datasets?q=5g&format=CSV&page=2`), so every
search can be bookmarked or shared.

## Sign-in and visibility

piveau decides what each caller may see (access control v2, see
`dataops-devops/docker/prd/dataspace/PIVEAU-UPGRADE-PLAN.md`):

| `dct:accessRights` | piveau level | Who sees it | Badge |
|---|---|---|---|
| `PUBLIC` | public | everyone | — |
| `RESTRICTED` | restricted | anyone signed in | *Signed-in users* |
| `NON_PUBLIC` | internal | members of the catalogue | *Members only* |

New records are *Members only* in every catalogue until an administrator publishes them in DataOps;
the badge shows a record's own level (its `dct:accessRights`), not its catalogue's.

The app calls hub-search and hub-repo **directly from the browser**, with the
user's bearer token when signed in and anonymously otherwise. It holds no
credentials and makes no access decision: badges and hints only describe what
piveau returned. If piveau rejects the token (401) the call is repeated
anonymously, so a broken session shows the public view rather than an error.
Both piveau services already allow the `Authorization` header in their CORS
configuration (checked against the live hosts).

Sign-in uses Keycloak (Authorization Code + PKCE, public client). Nothing forces
it: "Sign in" in the navbar or on the home page starts it, and the visitor comes
back to the page they were on. The session is kept in `sessionStorage` and
restored without the `check-sso` iframe, as in `portal-ui`. If Keycloak is
unreachable the catalogue still works, without sign-in.

**The realm must be piveau's** (`6gdali`), or piveau will not accept the token.
The default client is the existing `piveau-hub-ui`. It must be a public client
with Standard flow and PKCE, and list the catalogue origin in *Valid redirect
URIs* (`https://catalogue.dataspace.6gdali.eu/*`), *Valid post logout redirect
URIs* and *Web origins*.

Signed in, the username opens the realm's Keycloak account console, and a
*Publish data* link goes to DataOps (if `dataopsUrl` is set). Catalogue and
member management are not in this app yet (see follow-ups).

## Configuration

Resolved at run time like the other front ends: `window.__DALI_CONFIG__`
(`config.js`) → `VITE_*` at build time → defaults in `src/config.ts`. The image
writes `config.js` at start from these variables; unset ones keep the defaults.

| Variable | Key | Default |
|---|---|---|
| `VITE_SEARCH_API_URL` | `searchApiUrl` | `https://search.dataspace.6gdali.eu` |
| `VITE_REPO_API_URL` | `repoApiUrl` | `https://dataspace.6gdali.eu` |
| `VITE_MODELS_CATALOGUE` | `modelsCatalogue` | `6g-dali-models` |
| `VITE_SERVICES_CATALOGUE` | `servicesCatalogue` | `6g-dali-services` |
| `VITE_AUTH_URL` | `authUrl` | `https://auth.6gdali.eu/auth` |
| `VITE_KEYCLOAK_REALM` | `keycloakRealm` | `6gdali` |
| `VITE_KEYCLOAK_CLIENT_ID` | `keycloakClientId` | `piveau-hub-ui` |
| `VITE_DALI_URL`, `VITE_PORTAL_URL`, `VITE_DATASPACE_URL`, `VITE_DATAOPS_URL`, `VITE_MLOPS_URL` | navbar tool links | project site only |

Two more variables shape the Content-Security-Policy (nginx template):

| Variable | Default |
|---|---|
| `KEYCLOAK_ORIGIN` | `https://auth.6gdali.eu` |
| `PIVEAU_ORIGINS` | `https://search.dataspace.6gdali.eu https://dataspace.6gdali.eu` |

If either is wrong, sign-in or search fails with a CSP violation in the browser
console and nothing in any server log — check these first.

The variables of the previous Vue image (`VITE_API_HUB_SEARCH_URL`,
`VITE_AUTHENTICATION_KEYCLOAK_*`, `VITE_THEME_COLORS`, `VITE_LOGO_URL`, social
links, …) are no longer read. The container still listens on **8080**, so the
`piveau-hub-ui` service in `dataops-devops/docker/prd/dataspace/docker-compose.yaml`
only needs its `environment:` replaced:

```yaml
    environment:
      - VITE_SEARCH_API_URL=https://${SEARCH_DOMAIN}
      - VITE_REPO_API_URL=https://${DSPACE_DOMAIN}
      - VITE_AUTH_URL=https://${AUTH_DOMAIN}/auth
      - VITE_KEYCLOAK_REALM=6gdali
      - VITE_KEYCLOAK_CLIENT_ID=piveau-hub-ui
      - VITE_MODELS_CATALOGUE=6g-dali-models
      - VITE_SERVICES_CATALOGUE=6g-dali-services
      - VITE_DALI_URL=https://6gdali.eu/
      - VITE_PORTAL_URL=${PORTAL_URL:-}
      - VITE_DATAOPS_URL=${DATAOPS_URL:-}
      - KEYCLOAK_ORIGIN=https://${AUTH_DOMAIN}
      - PIVEAU_ORIGINS=https://${SEARCH_DOMAIN} https://${DSPACE_DOMAIN}
```

Old deep links of the Vue UI (`/datasets/<id>`) still load the app, which then
opens its home page.

## Development

```bash
npm install
npm run dev          # http://localhost:3200, against the live piveau (public data)
npm test             # vitest: search state, access levels, RDF parsing (fixtures from the live hub)
npm run type-check
npm run build
```

Sign-in from `localhost` needs `http://localhost:3200/*` on the Keycloak
client; without it the public pages work and sign-in fails at Keycloak.

```bash
docker build --build-arg GIT_SHA=$(git rev-parse --short HEAD) -t dataspace-ui .
docker run -p 18999:8080 dataspace-ui
```

## Structure

```
src/
├── main.tsx            # theme, Keycloak start-up (never blocks the public pages), render
├── App.tsx             # routes
├── router.ts           # hash router
├── config.ts           # runtime config
├── auth/session.ts     # optional sign-in, stored session, tokens for API calls
├── api/piveau.ts       # hub-search and hub-repo calls
├── lib/                # pure helpers, unit-tested: search state, access levels, JSON-LD reading
├── components/         # Layout (AppShell), search, catalogue cards, distributions, quality
└── pages/              # home, catalogues, catalogue, record
```

## Follow-ups

- **Management console.** Creating catalogues, choosing their visibility and
  managing members (the Keycloak groups piveau checks) is still to be built —
  the open decision "Data Lab API or our own code" in the upgrade plan. The
  natural place is a signed-in section of this app, backed by the
  orchestrator.
- **A sign-in slot in `@6g-dali/ui-shell`.** The shell has no place for a
  "Sign in" button, so the app passes it as the username with an account
  action. An `onLogin` prop in the shell would be cleaner.
- Linked-data links open without the user's token, so they work only for public
  records.
- The Vue UI's imprint and privacy pages were piveau's demo text (Fraunhofer
  FOKUS) and are not carried over; 6G-DALI's own should be linked from the
  footer once they exist.
