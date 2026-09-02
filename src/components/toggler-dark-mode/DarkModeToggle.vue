<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getPreferredTheme, toggleTheme } from '@6g-dali/ui-theme/theme.js'
// The shared shell's toggle styling (icon + track/thumb switch) — the same
// classes @6g-dali/ui-shell's React ThemeToggle uses, so this control looks
// identical to dataops-ui/portal-ui's rather than growing its own look.
import '@6g-dali/ui-theme/shell.css'

// Shared with dataops-ui/portal-ui: the same `data-theme` attribute and
// localStorage key drive both this app's own light/dark content palette
// (tailwind.css's `:root[data-theme="dark"]` block) and @6g-dali/ui-theme's
// chrome tokens (tokens.css's `:root[data-theme="light"]` block) at once.
// main.ts calls initTheme() before first paint; this only reflects and
// flips the result afterward.
const isDark = ref(false)

function handleToggle() {
  isDark.value = toggleTheme() === 'dark'
}

onMounted(() => {
  isDark.value = getPreferredTheme() === 'dark'
})
</script>

<template>
  <label class="dali-theme-toggle" :title="isDark ? 'Switch to light theme' : 'Switch to dark theme'">
    <svg
      class="dali-theme-toggle-icon"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        v-if="!isDark"
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
      <path
        v-else
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>

    <span class="dali-theme-toggle-track">
      <input
        type="checkbox"
        class="dali-theme-toggle-input"
        :checked="isDark"
        :aria-label="isDark ? 'Switch to light theme' : 'Switch to dark theme'"
        @change="handleToggle"
      >
      <span class="dali-theme-toggle-thumb" />
    </span>
  </label>
</template>
