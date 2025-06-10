<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import router from '@/router'

const { locale } = useI18n()
const route = useRoute()
const currentLanguage = ref('en')
const isDropdownOpen = ref(false)
const dropdownRef = ref(null)

const languages = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' }
]

// Watch for URL query parameter changes
watch(
  () => route.query.locale,
  (newLocale) => {
    if (newLocale && ['en', 'de'].includes(newLocale as string)) {
      selectLanguage(newLocale as string)
    }
  }
)

const selectLanguage = (languageCode: string) => {
  currentLanguage.value = languageCode
  locale.value = languageCode
  localStorage.setItem('language', languageCode)
  isDropdownOpen.value = false

  // Update URL query parameter
  const newQuery = { ...route.query, locale: languageCode }
  router.replace({ query: newQuery })
}

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value
}

const closeDropdown = (event: Event) => {
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
  } else {
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
  <div class="relative" ref="dropdownRef">
    <!-- Dropdown Button -->
    <button
      @click="toggleDropdown"
      class="flex items-center gap-2 px-3 py-2 text-sm font-medium text-surface-text hover:text-primary-hover rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-surface-900"
      :class="{ 'bg-surface-100 dark:bg-surface-800': isDropdownOpen }"
    >
      <!-- Current Language Flag -->
      <span class="text-sm">
        {{ languages.find(lang => lang.code === currentLanguage)?.flag }}
      </span>

      <!-- Current Language Code -->
      <span class="text-sm font-medium">
        {{ currentLanguage.toUpperCase() }}
      </span>

      <!-- Dropdown Arrow -->
      <svg
        class="w-4 h-4 transition-transform duration-200"
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
      class="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 dark:ring-white dark:ring-opacity-10 z-50"
    >
      <div class="py-1">
        <button
          v-for="language in languages"
          :key="language.code"
          @click="selectLanguage(language.code)"
          class="flex items-center gap-3 w-full px-4 py-2 text-sm text-surface-text hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-primary-hover transition-colors"
          :class="{
            'bg-primary-50 dark:bg-primary-900/20 text-primary': currentLanguage === language.code
          }"
        >
          <!-- Language Flag -->
          <span class="text-base">{{ language.flag }}</span>

          <!-- Language Details -->
          <div class="flex flex-col items-start">
            <span class="font-medium">{{ language.label }}</span>
            <span class="text-xs text-surface-text-muted">{{ language.code.toUpperCase() }}</span>
          </div>

          <!-- Selected Indicator -->
          <svg
            v-if="currentLanguage === language.code"
            class="w-4 h-4 ml-auto text-primary"
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
