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
  <footer class="bg-footer-bg px-8 py-16 text-footer-bg-text">
    <div class="container mx-auto max-w-7xl space-y-32">
      <div
        class="
          flex flex-col flex-wrap justify-between gap-x-10 gap-y-20
          md:flex-row
          xl:gap-10
        "
      >
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

        <!-- Login Section -->
        <div
          class="
            w-full
            md:w-3/12
            xl:w-2/12
          "
        >
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
      </div>
    </div>
  </footer>
</template>
