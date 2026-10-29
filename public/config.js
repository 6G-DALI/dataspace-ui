/*
 * Runtime configuration, read through the shared __DALI_CONFIG__ key (the same
 * key dataops-ui and portal-ui read). In the image this file is rewritten at
 * start by docker-entrypoint.d/40-catalogue-config.sh from the VITE_* variables;
 * this copy is what `npm run dev` uses. Empty values fall back to src/config.ts.
 */
window.__DALI_CONFIG__ = {
  // Shared 6G-DALI tool suite (navbar links). Empty drops the link.
  daliUrl: 'https://6gdali.eu/',
  portalUrl: '',
  dataspaceUrl: '',
  dataopsUrl: '',
  mlopsUrl: '',

  // piveau
  searchApiUrl: 'https://search.dataspace.6gdali.eu',
  repoApiUrl: 'https://dataspace.6gdali.eu',
  modelsCatalogue: '6g-dali-models',
  servicesCatalogue: '6g-dali-services',

  // DataOps orchestrator: signs download links for Data Lake files. Empty: the raw link.
  downloadApiUrl: 'https://dataops.6gdali.eu/api',

  // Sign-in. Must be piveau's realm, or piveau will not accept the token.
  authUrl: 'https://auth.6gdali.eu/auth',
  keycloakRealm: '6gdali',
  keycloakClientId: 'piveau-hub-ui',
}
