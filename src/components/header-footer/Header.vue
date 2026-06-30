<!-- src/components/header-footer/Header.vue -->
<script setup>
import KButton from '@/components/base/button/KButton.vue'
import LanguageSelector from '@/components/language-selector/LanguageSelector.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import appConfig from '@config/appConfig'
import DarkModeToggle from '../toggler-dark-mode/DarkModeToggle.vue'
import NavigationBar from './NavigationBar.vue'

const { t } = useI18n()
const visible = ref(false)
const projectTitle = appConfig.projectTitle
const projectUrl = appConfig.projectUrl
const logoUrl = appConfig.logoUrl
</script>

<template>
  <header class="border-gray-200 bg-header-bg text-header-bg-text">
    <div class="container mx-auto px-2 py-8 relative">
      <div class="flex items-center justify-between">
        <!-- Left: Logo -->
        <div class="flex items-center flex-shrink-0">
          <RouterLink class="block" to="/">
            <img :src="logoUrl" :alt="projectTitle || 'Logo'" class="h-12 object-contain">
          </RouterLink>
        </div>

        <!-- Center: Navigation -->
        <div class="flex nav-center absolute min-w-0 flex-1 justify-center px-2">
          <div class="hidden min-w-0 overflow-x-auto md:block">
            <NavigationBar />
          </div>
        </div>

        <!-- Right: Actions (kept to the right, no overlap) -->
        <div class="flex shrink-0 items-center justify-end gap-3 sm:gap-4">
          <div class="md:hidden">
            <KButton variant="null" class="text-header-bg-text" @click="visible = !visible">
              <i class="icon-[ph--list]" />
            </KButton>
          </div>

          <div class="mr-2 hidden items-center gap-1 md:flex lg:mr-2 lg:px-4">
            <LanguageSelector />
            <DarkModeToggle />
          </div>

          <div class="hidden items-center gap-3 md:flex">
            <a
              v-if="projectUrl"
              target="_blank"
              :href="projectUrl"
              class="ml-2 inline-flex items-center whitespace-nowrap text-header-bg-text hover:text-secondary"
            >
              {{ projectTitle }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- mobile menu -->
    <div class="mx-auto px-6 py-8 md:hidden" :class="{ hidden: !visible }">
      <NavigationBar direction="vertical" />
      <div class="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-8">
        <LanguageSelector />
        <a
          target="_blank"
          href="https://doc.piveau.eu/general/introduction/"
          class="text-fg inline-flex items-center font-light hover:text-primary-hover"
        >
          {{ t('landing-page.header.docs') }}
        </a>
        <a
          target="_blank"
          href="https://gitlab.com/piveau/"
          class="text-fg inline-flex items-center font-light hover:text-primary-hover"
          aria-label="GitLab"
          title="GitLab"
        >
          <img
            src="../../assets/images/icons8-gitlab-48.png"
            alt="Gitlab"
            class="h-4 w-4 shrink-0 object-contain"
          >
        </a>
      </div>
    </div>
  </header>
</template>

<style>
.nav-center {
  left: 50%;
  transform: translateX(-50%);
}
.brand {
  margin-left: 20px;
  display: flex;
}

.logo-dark {
  display: none;
}

.logo-light {
  display: block;
}

:root[data-theme="dark"] .logo-dark {
  display: block;
}

:root[data-theme="dark"] .logo-light {
  display: none;
}
.navgationbar {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
