<script setup lang="ts">
import router from '@/router'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { locale } = useI18n()
const route = useRoute()
const currentLanguage = ref('en')
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

// Watch for URL query parameter changes
watch(
  () => route.query.locale,
  (newLocale) => {
    if (newLocale && ['en', 'de'].includes(newLocale as string)) {
      selectLanguage(newLocale as string)
    }
  },
)

function selectLanguage(languageCode: string) {
  currentLanguage.value = languageCode
  locale.value = languageCode
  localStorage.setItem('language', languageCode)
  isDropdownOpen.value = false

  // Update URL query parameter
  const newQuery = { ...route.query, locale: languageCode }
  router.replace({ query: newQuery })
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value
}

function closeDropdown(event: Event) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false
  }
}

onMounted(() => {
  // First check URL query parameter
  const urlLocale = route.query.locale as string
  if (urlLocale && ['en', 'de'].includes(urlLocale)) {
    currentLanguage.value = urlLocale
    locale.value = urlLocale
  }
  else {
    // Fall back to localStorage if no URL parameter
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && ['en', 'de'].includes(savedLanguage)) {
      currentLanguage.value = savedLanguage
      locale.value = savedLanguage
    }
  }
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-surface hover:text-primary-hover rounded-md hover:bg-header-bg dark:hover:bg-surface-800 transition-colors focus:outline-none focus:ring-1 focus:ring-primary focus:ring-offset-2 dark:focus:bg-header-bg"
      :class="{ 'bg-surface-100 dark:bg-surface-800': isDropdownOpen }"
    >
      <!-- Current Language Flag -->
      <span class="text-sm">
        {{ languages.find(lang => lang.code === currentLanguage)?.flag }}
      </span>

      <!-- Current Language Code -->
      <span class="text-sm font-light text-header-bg-text">
        {{ currentLanguage.toUpperCase() }}
      </span>

      <!-- Dropdown Arrow -->
      <svg
        class="w-4 h-4 transition-transform duration-200 text-header-bg-text"
        :class="{ 'rotate-180': isDropdownOpen }"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
      </svg>
    </button>

    <!-- Dropdown Menu -->
  <div
  v-show="isDropdownOpen"
  class="
    ring-opacity-5 absolute right-0 z-50 mt-2 w-48 rounded-md bg-surface
    shadow-lg ring-1 ring-black
    dark:ring-opacity-10 dark:bg-surface-900 dark:ring-white
    sm:w-48 w-full left-0 right-0 mx-auto
  "
>
      <div class="py-1">
        <button
          v-for="language in languages"
          :key="language.code"
          class="
            flex w-full items-center gap-3 px-4 py-2 text-sm text-surface-text
            transition-colors
            hover:bg-surface-100 hover:text-primary-hover
            dark:hover:bg-surface-800
          "
          :class="{
            'bg-primary-50 text-primary dark:bg-primary-900/20': currentLanguage === language.code,
          }"
          @click="selectLanguage(language.code)"
        >
          <!-- Language Flag -->
          <span class="text-base">{{ language.flag }}</span>

          <!-- Language Details -->
          <div class="flex flex-col items-start">
            <span class="font-medium">{{ language.label }}</span>
            <span class="text-surface-text-muted text-xs">{{ language.code.toUpperCase() }}</span>
          </div>

          <!-- Selected Indicator -->
          <svg
            v-if="currentLanguage === language.code"
            class="ml-auto h-4 w-4 text-primary"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Additional custom styles if needed */
</style>
