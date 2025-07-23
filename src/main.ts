import i18n from '@/i18n'
import router from '@/router'
import { plugin as piveauPlugin } from '@piveau/sdk-vue'
import { de, en } from '@piveau/sdk-vue/locale'
import { QueryClient, VueQueryPlugin } from '@tanstack/vue-query'

import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import PrimeVue from 'primevue/config'

import { createApp } from 'vue'

import App from './App.vue'
import KDW from './components/base/preset/index.js'
import { configureMarked } from './sdk/utils/configureMarked'
import './assets/stylesheets/reset.css'
import './assets/stylesheets/fonts.css'
import './assets/tailwind.css'
import './assets/base.css'
import '@fontsource-variable/inter'
import '@fontsource-variable/space-grotesk'

async function renderApp() {
  // const { worker } = await import('./services/msw')
  // worker.start()

  const app = createApp(App)

  const qc = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0,
      },
    },
  })

  const pinia = createPinia()
  pinia.use(piniaPluginPersistedstate)

  app.use(router)

  app.use(VueQueryPlugin, {
    queryClient: qc,
  })

  app.use(piveauPlugin, {
    queryClient: qc,
    locale: {
      messages: {
        de: {
          ...de,
          metadata: {
            ...de.metadata,
            modificationDate: 'Zuletzt aktualisiert', // Proper German translation
          },
        },
        en: {
          ...en,
          metadata: {
            ...en.metadata,
            modificationDate: 'Last modified', // English translation
          },
        },
      },
      locale: i18n.global.locale.valueOf(),
      fallbackLocale: 'en',
      dateFormatStrings: {
        short: 'DD.MM.YYYY',
        medium: 'DD.MM.YYYY',
        long: 'DD. MMMM YYYY HH:mm:ss',
      },
    },
  })

  app.use(PrimeVue, {
    unstyled: true,
    pt: KDW,
  })

  app.use(pinia)

  app.use(i18n).mount('#app')
}

configureMarked()

if (import.meta.hot) {
  import.meta.hot.accept()
}
renderApp()
