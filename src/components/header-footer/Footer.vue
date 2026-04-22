<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

// Make link arrays reactive using computed properties
const seitenLinks = computed(() => [
  { to: '/', text: t('footer.links.home') },
  { to: '/datasets', text: t('footer.links.datasets') },
  { to: '/catalogues', text: t('footer.links.catalogues') },
  { to: '/Themer', text: t('footer.links.themeGenerator') },
  { to: 'https://doc.piveau.eu/general/introduction/', text: t('footer.links.docs') },
  { to: 'https://gitlab.com/piveau/', text: t('footer.links.gitlab') },
])

const socialLinks = computed(() => [
  { href: 'https://www.linkedin.com/company/fraunhoferfokus/?originalSubdomain=de', text: t('footer.links.linkedin') },
])

const rechtlichesLinks = computed(() => [
  { to: '/imprint', text: t('footer.links.imprint') },
  { to: '/privacypolicy', text: t('footer.links.dataPrivacy') },
])

const loginLinks = computed(() => [
  { to: '#', text: t('footer.links.login') },
  { href: 'https://www.piveau.de/#contact', text: t('footer.links.contact') },
])
</script>

<template>
  <footer class="bg-footer-bg px-8 py-16 text-footer-bg-text md:px-30">
    <div class="container mx-auto max-w-7xl">
  
      <div class="flex flex-col flex-wrap justify-between gap-x-10 gap-y-20 md:flex-row">
        
        <!-- Login Section (links) -->
        <div class="w-full md:w-3/12 md:mr-10 xl:w-2/12">
          <img src="/piveau-logo.png" alt="piveau logo" class="mb-6 w-24">
          <ul class="flex flex-col gap-4">
            <li v-for="link in loginLinks" :key="link.text" class="text-copy-sm">
              <template v-if="link.href">
                <a :href="link.href" target="_blank" rel="noopener noreferrer"
                   class="font-bold hover:text-secondary-hover">
                  {{ link.text }}
                </a>
              </template>
              <template v-else>
                <RouterLink :to="link.to" class="font-bold hover:text-secondary-hover">
                  {{ link.text }}
                </RouterLink>
              </template>
            </li>
          </ul>
        </div>

        
        <div class="flex flex-col flex-wrap gap-x-32 gap-y-20 md:flex-row">
          <!-- Sitemap -->
          <div>
            <h3 class="mb-4 text-xl font-semibold">
              {{ t('footer.sections.sitemap') }}
            </h3>
            <ul class="flex flex-col">
              <li v-for="link in seitenLinks" :key="link.text" class="text-copy-sm">
                <template v-if="link.to.startsWith('http')">
                  <a :href="link.to" target="_blank" rel="noopener noreferrer"
                     class="hover:text-secondary-hover">
                    {{ link.text }}
                  </a>
                </template>
                <template v-else>
                  <RouterLink :to="link.to" class="hover:text-secondary-hover">
                    {{ link.text }}
                  </RouterLink>
                </template>
              </li>
            </ul>
          </div>

          <!-- Social Media -->
          <div>
            <h3 class="mb-4 text-xl font-semibold">
              {{ t('footer.sections.socialMedia') }}
            </h3>
            <ul class="flex flex-col gap-0">
              <li v-for="link in socialLinks" :key="link.text" class="text-copy-sm">
                <a :href="link.href" target="_blank" class="hover:text-secondary-hover">
                  {{ link.text }}
                </a>
              </li>
            </ul>
          </div>

          <!-- Legal -->
          <div>
            <h3 class="mb-4 text-xl font-semibold">
              {{ t('footer.sections.legal') }}
            </h3>
            <ul class="flex flex-col gap-0">
              <li v-for="link in rechtlichesLinks" :key="link.text" class="text-copy-sm">
                <RouterLink :to="link.to" class="hover:text-secondary-hover">
                  {{ link.text }}
                </RouterLink>
              </li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  </footer>
</template>
