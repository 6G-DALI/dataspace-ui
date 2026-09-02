<script setup>

import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import appConfig from '@config/appConfig'

const { t } = useI18n()

// Make link arrays reactive using computed properties
const seitenLinks = computed(() => [
  { to: '/', text: t('footer.links.home') },
  { to: '/datasets', text: t('footer.links.datasets') },
  { to: '/catalogues', text: t('footer.links.catalogues') },
])

const socialLinks = computed(() =>
  [
    { href: appConfig.socialLinkedIn,  text: 'LinkedIn'  },
    { href: appConfig.socialTwitter,   text: 'X / Twitter' },
    { href: appConfig.socialYouTube,   text: 'YouTube'   },
    { href: appConfig.socialFacebook,  text: 'Facebook'  },
    { href: appConfig.socialGitHub,    text: 'GitHub'    },
  ].filter(l => !!l.href)
)

const rechtlichesLinks = computed(() => [
  { to: '/imprint', text: t('footer.links.imprint') },
  { to: '/privacypolicy', text: t('footer.links.dataPrivacy') },
])

const loginLinks = computed(() => [
  { to: '#', text: t('footer.links.login') },
  ...(appConfig.contactEmail ? [{ href: `mailto:${appConfig.contactEmail}`, text: appConfig.contactEmail }] : []),
])
</script>

<template>
  <footer class="dali-footer px-8 py-16">
    <div class="container mx-auto max-w-7xl space-y-32">
      <div
        class="
          flex flex-col flex-wrap justify-between gap-x-10 gap-y-20
          md:flex-row
          xl:gap-10
        "
      >
        <!-- Login Section -->
        <div
          class="
            w-full
            md:w-3/12
            xl:w-2/12
          "
        >
        <img :src="appConfig.logoUrl" :alt="appConfig.projectTitle || 'Logo'" class="mb-2 h-12 object-contain">
          <p class="dali-footer-brand mb-6">6G-<span class="dali-accent">DALI</span></p>
          <ul class="flex flex-col gap-4">
            <li
              v-for="link in loginLinks"
              :key="link.text"
              class="text-copy-sm"
            >
              <template v-if="link.href">
        <a
          :href="link.href"
          target="_blank"
          rel="noopener noreferrer"
          class="font-bold hover:text-secondary-hover"
        >
          {{ link.text }}
        </a>
      </template>
      <template v-else>
        <RouterLink
          :to="link.to"
          class="font-bold hover:text-secondary-hover"
        >
          {{ link.text }}
        </RouterLink>
      </template>
            </li>
          </ul>
        </div>
        <!-- Sitemap Section -->
        <div
          class="
            mr-10 w-full
            md:w-3/12
            xl:w-2/12
          "
        >
          <h3 class="mb-4 text-xl font-semibold">
            {{ t('footer.sections.sitemap') }}
          </h3>
          <ul class="flex flex-col gap-0">
            <li
              v-for="link in seitenLinks"
              :key="link.text"
              class="text-copy-sm"
            >
              <template v-if="link.to.startsWith('http')">
                <a
                  :href="link.to"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="hover:text-secondary-hover"
                >
                  {{ link.text }}
                </a>
              </template>
              <template v-else>
                <RouterLink
                  :to="link.to"
                  class="hover:text-secondary-hover"
                >
                  {{ link.text }}
                </RouterLink>
              </template>
            </li>
          </ul>
        </div>

        <!-- Social Media Section -->
        <div
          class="
            w-full
            md:w-3/12
            xl:w-2/12
          "
        >
          <h3 class="mb-4 text-xl font-semibold">
            {{ t('footer.sections.socialMedia') }}
          </h3>
          <ul class="flex flex-col gap-0">
            <li
              v-for="link in socialLinks"
              :key="link.text"
              class="text-copy-sm"
            >
              <a
                :href="link.href"
                target="_blank"
                class="hover:text-secondary-hover"
              >
                {{ link.text }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Legal Section -->
        <div
          class="
            mr-10 w-full
            md:w-3/12
            xl:w-2/12
          "
        >
          <h3 class="mb-4 text-xl font-semibold">
            {{ t('footer.sections.legal') }}
          </h3>
          <ul class="flex flex-col gap-0">
            <li
              v-for="link in rechtlichesLinks"
              :key="link.text"
              class="text-copy-sm"
            >
              <RouterLink
                :to="link.to"
                class="hover:text-secondary-hover"
              >
                {{ link.text }}
              </RouterLink>
            </li>
          </ul>
        </div>

      
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Same dark chrome as Sidebar.vue/Header.vue, per §2.4 consistency. */
.dali-footer {
  background: var(--bg-surface);
  color: var(--text-secondary);
  border-top: 1px solid var(--border);
}

.dali-footer :deep(h3) {
  color: var(--text-primary);
}

/* Shared 6G-DALI brand accent — same color as dataops-ui/portal-ui's .dali-accent. */
.dali-accent {
  color: #f2712c;
}

/* Muted mono caption under the logo, matching ui-theme's .app-footer-build styling. */
.dali-footer-brand {
  font-family: var(--font-mono, monospace);
  font-size: 0.75rem;
  color: var(--text-muted, inherit);
  letter-spacing: 0.02em;
}
</style>
