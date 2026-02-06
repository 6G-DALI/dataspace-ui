<!-- src/components/header-footer/Header.vue -->
<script setup>
import KButton from '@/components/base/button/KButton.vue'
import LanguageSelector from '@/components/language-selector/LanguageSelector.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DarkModeToggle from '../toggler-dark-mode/DarkModeToggle.vue'
import NavigationBar from './NavigationBar.vue'

const { t } = useI18n()
const visible = ref(false)
</script>

<template>
  <header class="border-gray-200 bg-header-bg text-header-bg-text">
    <div class="lg:container mx-auto px-2 md:px-10 py-8">
      <div class="flex items-center gap-4">
        <!-- Left: Logo -->
        <div class="flex items-center flex-shrink-0">
          <RouterLink class="block" to="/">
            <img src="/piveau-logo-gray.svg" alt="piveau logo" class="logo logo-light w-25">
            <img src="/piveau-logo.png" alt="piveau logo" class="logo logo-dark w-24">
          </RouterLink>
        </div>

        <!-- Center: Navigation -->
        <div class="flex flex-1 justify-center">
          <div class="hidden md:block">
            <NavigationBar />
          </div>
        </div>

        <!-- Right: Actions (kept to the right, no overlap) -->
        <div class="flex items-center justify-end gap-6">
          <div class="md:hidden">
            <KButton variant="null" class="text-header-bg-text" @click="visible = !visible">
              <i class="icon-[ph--list]" />
            </KButton>
          </div>

          <div class="hidden items-center gap-1 md:flex mr-5 px-8">
            <LanguageSelector />
            <DarkModeToggle />
          </div>

          <div class="hidden items-center gap-4 md:flex ml-4">
            <a
              target="_blank"
              href="https://doc.piveau.eu/general/introduction/"
              class="flex items-center ml-4 text-header-bg-text"
            >
              {{ t('landing-page.header.docs') }}
            </a>
            <a
              target="_blank"
              href="https://gitlab.com/piveau/"
              class="flex items-center font-light text-header-bg-text"
            >
              <img
                src="../../assets/images/icons8-gitlab-48.png"
                alt="Gitlab"
                class="mr-1 h-5 w-5 shrink-0 object-contain"
              >
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- mobile menu unchanged -->
    <div class="mx-auto px-6 py-8 md:hidden" :class="{ hidden: !visible }">
      <NavigationBar direction="vertical" />
      <div class="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-8">
        <LanguageSelector />
        <a
          target="_blank"
          href="https://doc.piveau.eu/general/introduction/"
          class="text-fg flex items-center font-light hover:text-primary-hover"
        >
          Docs
        </a>
        <a
          target="_blank"
          href="https://gitlab.com/piveau/"
          class="text-fg flex items-center font-light hover:text-primary-hover"
        >
          <img src="../../assets/images/icons8-gitlab-48.png" alt="Gitlab" class="mr-1 size-4">
        </a>
      </div>
    </div>
  </header>
</template>

<style>
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
</style>
