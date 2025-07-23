import developmentConfig from './config.dev.js'
import productionConfig from './config.js'

export interface Configuration {
  appUrl: string
  keycloakUrl: string
  keycloakRealm: string
  keycloakClientId: string
  supersetUrl: string
  piveauHubSearchUrl: string
}

export default import.meta.env.MODE === 'production' ? productionConfig : developmentConfig
