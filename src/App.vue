<script setup lang="ts">
import { useTitle } from '@vueuse/core'
import { ref } from 'vue'
import appConfig from '../config/appConfig'
import { useRuntimeTheme } from './composables/useRuntimeTheme'
import Footer from './components/header-footer/Footer.vue'
import Header from './components/header-footer/Header.vue'
import Sidebar from './components/header-footer/Sidebar.vue'

// The browser tab title is applied at runtime from config: the static title in
// index.html is not touched by the container's envsubst step (only the JS
// bundle is), so VITE_APP_TITLE is wired in here instead.
useTitle(appConfig.appTitle || 'piveau - Metadata Catalogue')

// Apply env-driven theme color overrides (VITE_COLOR_*) at runtime.
useRuntimeTheme()

// §6.1: fixed left sidebar, collapsible to 72px. Desktop only — on mobile the
// sidebar becomes a drawer opened from Header's hamburger instead.
const sidebarCollapsed = ref(false)
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar class="sticky top-0 hidden shrink-0 md:flex" :collapsed="sidebarCollapsed" @toggle="sidebarCollapsed = !sidebarCollapsed" />
    <div class="flex min-w-0 flex-1 flex-col">
      <Header />
      <div class="flex-1 overflow-y-auto">
        <RouterView />
      </div>
      <Footer class="mt-auto" />
    </div>
  </div>
</template>
