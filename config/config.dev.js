export default {
  appUrl: 'http://localhost:5173',
  keycloakUrl: import.meta.env.VITE_AUTHENTICATION_KEYCLOAK_URL,
  keycloakRealm: import.meta.env.VITE_AUTHENTICATION_KEYCLOAK_REALM,
  keycloakClientId: import.meta.env.VITE_AUTHENTICATION_KEYCLOAK_CLIENT_ID,
  supersetUrl: '',
  piveauHubSearchUrl: import.meta.env.VITE_API_HUB_SEARCH_URL || 'https://data.europa.eu/api/hub/search/',
  piveauHubRepoUrl: import.meta.env.VITE_API_HUB_REPO_URL || 'https://data.europa.eu/api/hub/repo/',
  piveauHubStoreUrl: import.meta.env.VITE_API_HUB_STORE_URL || 'https://data.europa.eu/api/hub/store/',
  piveauSparqlUrl: 'https://data.europa.eu/sparql',
}
