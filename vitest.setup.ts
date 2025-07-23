import { config } from '@vue/test-utils'
import { createI18n } from 'vue-i18n'

export const i18n = createI18n({
  legacy: false,
  locale: 'de',
  fallbackLocale: 'en',
  messages: {
    en: {
      views: {
        app: {

        },
      },
    },
    de: {
      views: {
        app: {

        },
      },
    },
  },
})

config.global.plugins = [i18n]
