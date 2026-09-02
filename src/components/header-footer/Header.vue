<!-- src/components/header-footer/Header.vue -->
<!--
  The top bar, per general_gui_guidelines.md §7.2: current section, tool
  links and the user-facing controls — 64px, dark chrome to match the
  sidebar. Primary navigation itself now lives in Sidebar.vue (§6.1/§7.1);
  on mobile the sidebar becomes a drawer opened from here (§23).
-->
<script setup>
import KButton from '@/components/base/button/KButton.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import appConfig from '@config/appConfig'
import DarkModeToggle from '../toggler-dark-mode/DarkModeToggle.vue'
import Sidebar from './Sidebar.vue'

const { t, te } = useI18n()
const route = useRoute()
const drawerOpen = ref(false)
const projectTitle = appConfig.projectTitle
const projectUrl = appConfig.projectUrl

// §7.2 "breadcrumb or current section" — the app has no multi-level
// breadcrumb trail yet, so this is just the active route's own label.
const currentSection = computed(() => {
  const name = route.name
  if (typeof name !== 'string') return ''
  const key = `landing-page.header.${name.toLowerCase()}`
  return te(key) ? t(key) : name
})

// The brand mark shared across every 6G-DALI front end: "DALI" in the suite's
// accent orange. Only applied when the configured title actually contains it,
// so a deployment with a different projectTitle just renders it plain.
const brandParts = computed(() => {
  const i = projectTitle?.indexOf('DALI') ?? -1
  if (i === -1) return null
  return { before: projectTitle.slice(0, i), after: projectTitle.slice(i + 4) }
})

// Cross-app links to the rest of the 6G-DALI suite, same labels/order/URLs as
// dataops-ui and portal-ui's daliTools(). A tool is dropped when its URL isn't
// configured rather than linking somewhere that doesn't exist.
const daliTools = computed(() => [
  { label: '6G-DALI', url: appConfig.daliUrl, title: 'The 6G-DALI project site' },
  { label: 'Portal', url: appConfig.portalUrl, title: 'The 6G-DALI Portal — all services and documentation' },
  { label: 'Data Space', url: appConfig.dataspaceUrl, title: 'Browse and search the 6G-DALI Data Space catalogue' },
  { label: 'Data Ops', url: appConfig.dataopsUrl, title: 'Data Ops — pipelines, datasets and data quality' },
  { label: 'ML Ops', url: appConfig.mlopsUrl, title: 'ML Ops — model training and serving' },
].filter(tool => !!tool.url))
</script>

<template>
  <header class="dali-topbar flex h-[var(--topbar-height)] items-center px-3 sm:px-4">
    <!-- Mobile: opens the sidebar as a drawer -->
    <div class="md:hidden">
      <KButton variant="null" class="dali-topbar-icon" @click="drawerOpen = !drawerOpen">
        <i class="icon-[ph--list]" />
      </KButton>
    </div>

    <div class="min-w-0 flex-1 px-2">
      <span class="dali-current-section truncate">{{ currentSection }}</span>
    </div>

    <div class="flex shrink-0 items-center justify-end gap-3 sm:gap-4">
      <!-- Cross-app links to the rest of the 6G-DALI suite -->
      <nav v-if="daliTools.length" class="hidden items-center gap-1 lg:flex" aria-label="6G-DALI tools">
        <a
          v-for="tool in daliTools"
          :key="tool.label"
          :href="tool.url"
          :title="tool.title"
          target="_blank"
          rel="noopener noreferrer"
          class="dali-tool-link"
        >
          {{ tool.label }}
        </a>
      </nav>

      <div class="hidden items-center gap-1 md:flex">
        <DarkModeToggle />
      </div>

    </div>
  </header>

  <!-- Mobile drawer: sidebar nav, tool links, language selector -->
  <div v-if="drawerOpen" class="dali-drawer-overlay md:hidden" @click.self="drawerOpen = false">
    <Sidebar class="!h-full" @toggle="drawerOpen = false" />
  </div>
</template>

<style>
.dali-topbar {
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border);
  color: var(--text-primary);
}

.dali-topbar-icon {
  color: var(--text-secondary);
}

.dali-current-section {
  font-family: var(--font-display, inherit);
  font-size: var(--size-section-title, 1.1rem);
  font-weight: 600;
  color: var(--text-primary);
}

/* Shared 6G-DALI brand accent — same color as dataops-ui/portal-ui's .dali-accent. */
.dali-accent {
  color: #f2712c;
}

.dali-brand-link {
  color: var(--text-secondary);
  text-decoration: none;
}

.dali-brand-link:hover,
.dali-brand-link:focus-visible {
  color: var(--text-primary);
}

/* Cross-app tool links. Sized down and muted relative to the primary nav so
   they read as secondary, matching their role in dataops-ui/portal-ui. */
.dali-tool-link {
  font-family: var(--font-body, inherit);
  font-size: 0.8rem;
  padding: 0.35rem 0.6rem;
  border-radius: var(--radius-sm, 6px);
  white-space: nowrap;
  color: var(--text-secondary, currentColor);
  opacity: 0.75;
}

.dali-tool-link:hover,
.dali-tool-link:focus-visible {
  opacity: 1;
  color: var(--accent-cyan, inherit);
}

.dali-drawer-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  background: var(--bg-overlay, rgba(10, 13, 18, 0.82));
}
</style>
