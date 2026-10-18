/**
 * Runtime configuration.
 *
 * Resolved by @6g-dali/ui-shell, like dataops-ui and portal-ui:
 * `window.__DALI_CONFIG__` (public/config.js, rendered at container start) →
 * `import.meta.env.VITE_*` (build time, `npm run dev`) → the defaults below.
 * One key for the whole suite, so the navbar links cannot disagree between apps.
 */
import { resolveConfig, DALI_ENV_KEYS, type DaliBaseConfig } from '@6g-dali/ui-shell'

export interface CatalogueConfig extends DaliBaseConfig {
  /** piveau hub-search: the catalogue and dataset search, and dataset summaries. */
  searchApiUrl: string
  /** piveau hub-repo: the RDF of each record (quality results, testbed context, logos, linked data). */
  repoApiUrl: string
  /** Catalogue whose records are ML models; they are labelled and listed as models. */
  modelsCatalogue: string
  /** Catalogue whose records are data services (dcat:DataService). */
  servicesCatalogue: string
}

export const config = resolveConfig<CatalogueConfig>({
  defaults: {
    daliUrl: 'https://6gdali.eu/',
    portalUrl: '',
    dataspaceUrl: '',
    dataopsUrl: '',
    mlopsUrl: '',

    // piveau checks the token against its own realm, so sign-in here must use
    // that realm (6gdali), not the realm the other DALI front ends may use.
    authUrl: 'https://auth.6gdali.eu/auth',
    keycloakRealm: '6gdali',
    keycloakClientId: 'piveau-hub-ui',

    searchApiUrl: 'https://search.dataspace.6gdali.eu',
    repoApiUrl: 'https://dataspace.6gdali.eu',
    modelsCatalogue: '6g-dali-models',
    servicesCatalogue: '6g-dali-services',
  },
  envKeys: {
    ...DALI_ENV_KEYS,
    // Same names portal-ui reads for the same two services.
    searchApiUrl: 'VITE_SEARCH_API_URL',
    repoApiUrl: 'VITE_REPO_API_URL',
    modelsCatalogue: 'VITE_MODELS_CATALOGUE',
    servicesCatalogue: 'VITE_SERVICES_CATALOGUE',
  },
  // Passed in: Vite substitutes import.meta.env in this file, not in the package.
  env: import.meta.env,
})

/** Keycloak's own account console for this realm: password, 2FA, sessions. */
export function accountConsoleUrl(): string | undefined {
  if (!config.authUrl || !config.keycloakRealm) return undefined
  return `${config.authUrl}/realms/${encodeURIComponent(config.keycloakRealm)}/account`
}
