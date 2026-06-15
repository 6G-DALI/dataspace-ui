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
  socialLinkedIn: string
  socialTwitter: string
  socialYouTube: string
  socialFacebook: string
  socialGitHub: string
  contactEmail: string
}

export default import.meta.env.MODE === 'production' ? productionConfig : developmentConfig
