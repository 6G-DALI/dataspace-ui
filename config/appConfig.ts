import developmentConfig from './config.dev.js'
import productionConfig from './config.js'

export interface Configuration {
  appUrl: string
  keycloakUrl: string
  keycloakRealm: string
  keycloakClientId: string
  supersetUrl: string
  piveauHubSearchUrl: string
  piveauHubRepoUrl: string
  piveauHubStoreUrl: string
  middlewareUrl: string
  piveauSparqlUrl: string
  piveauDataQualityUrl: string
  projectTitle: string
  projectUrl: string
  logoUrl: string
  appTitle: string
  // JSON string of theme color overrides, e.g.
  // '{"primary":"#1a3c7d","secondary":"#00b3a4","headerBg":"#0d1b2a"}'
  // Parsed at runtime by useRuntimeTheme. Empty = keep the built-in palette.
  themeColors: string
  socialLinkedIn: string
  socialTwitter: string
  socialYouTube: string
  socialFacebook: string
  socialGitHub: string
  contactEmail: string
  // Shared 6G-DALI tool suite, linked from the header. Same variable names as
  // dataops-ui/portal-ui (VITE_DALI_URL etc.) so one deployment config feeds
  // every front end. Empty = drop that link rather than point at nothing.
  daliUrl: string
  portalUrl: string
  dataspaceUrl: string
  dataopsUrl: string
  mlopsUrl: string
}

export default import.meta.env.MODE === 'production' ? productionConfig : developmentConfig
