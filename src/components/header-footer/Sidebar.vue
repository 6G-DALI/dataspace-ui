<!-- src/components/header-footer/Sidebar.vue -->
<!--
  The primary navigation, per general_gui_guidelines.md §6.1/§7.1: a fixed
  left sidebar carrying brand identity, primary nav and a collapse control,
  240px expanded / 72px collapsed. Built with Tailwind + the shared
  @6g-dali/ui-theme tokens (dark chrome), not Bootstrap/AdminLTE — vanilla's
  own light Tailwind/PrimeVue palette still drives the page content.
-->
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

defineProps<{ collapsed?: boolean }>()
const emit = defineEmits<{ toggle: [] }>()

const { t } = useI18n()
const route = useRoute()

// Primary nav — the same routes NavigationBar used to render horizontally.
// '/' redirects to '/datasets' (router.ts), so that entry is labeled "Home":
// it's the landing page, not a separate route.
const navItems = [
  { to: '/datasets', label: 'landing-page.header.home', icon: 'icon-[ph--house]' },
  { to: '/catalogues', label: 'landing-page.header.catalogues', icon: 'icon-[ph--stack]' },
]

function isActive(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <aside
    class="dali-sidebar flex h-screen flex-col"
    :class="collapsed ? 'w-[var(--sidebar-collapsed)]' : 'w-[var(--sidebar-width)]'"
  >
    <RouterLink to="/" class="dali-sidebar-brand">
      <span v-if="!collapsed" class="brand-text truncate">6G-<span class="dali-accent">DALI</span> Data Space</span>
      <span v-else class="brand-text" aria-hidden="true">D</span>
    </RouterLink>

    <nav class="flex-1 overflow-y-auto px-2 py-4">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="dali-nav-link"
        :class="{ active: isActive(item.to) }"
        :title="collapsed ? t(item.label) : undefined"
      >
        <i :class="item.icon" class="shrink-0 text-lg" aria-hidden="true" />
        <span v-if="!collapsed">{{ t(item.label) }}</span>
      </RouterLink>
    </nav>

    <button
      type="button"
      class="dali-nav-link dali-sidebar-collapse"
      :aria-label="collapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      @click="emit('toggle')"
    >
      <i :class="collapsed ? 'icon-[ph--caret-line-right]' : 'icon-[ph--caret-line-left]'" class="shrink-0 text-lg" aria-hidden="true" />
      <span v-if="!collapsed">Collapse</span>
    </button>
  </aside>
</template>

<style scoped>
.dali-sidebar {
  background: var(--bg-surface);
  border-right: 1px solid var(--border);
}

.dali-sidebar-brand {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 1rem;
  border-bottom: 1px solid var(--border);
  font-family: var(--font-display, inherit);
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
  text-decoration: none;
}

/* Same brand mark as dataops-ui/portal-ui's AppShell: "DALI" in the suite's
   accent orange, no logo image. */
.dali-accent {
  color: #f2712c;
}

/* Matches @6g-dali/ui-theme's .app-sidebar .nav-link exactly (theme.css):
   flush, no radius — a sidebar nav item is not a button. */
.dali-nav-link {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.55rem 0.75rem;
  border-radius: 0;
  border-left: 2px solid transparent;
  font-family: var(--font-body, inherit);
  font-size: var(--size-body, 0.875rem);
  color: var(--text-secondary);
  text-decoration: none;
  cursor: pointer;
  background: transparent;
  border-top: none;
  border-bottom: none;
  border-right: none;
  width: 100%;
  text-align: left;
  transition: color var(--duration-normal, 150ms) var(--ease-standard, ease),
    background var(--duration-normal, 150ms) var(--ease-standard, ease),
    border-color var(--duration-normal, 150ms) var(--ease-standard, ease);
}

.dali-nav-link:hover,
.dali-nav-link:focus-visible {
  background: var(--bg-elevated);
  color: var(--text-primary);
}

/* §7.1: the active item uses a cyan left border, elevated background,
   brighter text and a subtle glow. */
.dali-nav-link.active {
  background: var(--bg-elevated);
  border-left-color: var(--accent-cyan);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: inset 3px 0 12px -6px var(--accent-cyan);
}

.dali-sidebar-collapse {
  margin-top: auto;
  border-top: 1px solid var(--border);
  border-radius: 0;
  justify-content: center;
}
</style>
