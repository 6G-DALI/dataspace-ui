<script setup lang="ts">
import { clsx } from 'clsx'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const showDropdown = ref(false)
const sortDirection = defineModel<string>('direction', { default: 'desc' })
const sortDirectionClass = computed(() =>
  clsx([
    'mr-2 text-surface-text',
    {
      'icon-[ph--arrow-up]': sortDirection.value === 'asc',
      'icon-[ph--arrow-down]': sortDirection.value === 'desc',
    },
  ]),
)
const checked = computed({
  get() {
    return sortDirection.value === 'asc'
  },
  set(value: boolean) {
    sortDirection.value = value ? 'asc' : 'desc'
  },
})

const sortOptions = computed(() => [
  { name: t('kdw.components.sort-split-button.SortSplitButton.sortOptions.modified'), id: 'modified' },
  { name: t('kdw.components.sort-split-button.SortSplitButton.sortOptions.relevance'), id: 'relevance' },
  { name: t('kdw.components.sort-split-button.SortSplitButton.sortOptions.title'), id: 'title.en' },
  { name: t('kdw.components.sort-split-button.SortSplitButton.sortOptions.issued'), id: 'issued' },
])
const sort = defineModel<string>('sort', { default: 'modified' })

const selectedOption = computed(() => sortOptions.value.find(opt => opt.id === sort.value)?.name ?? '')

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

function selectOption(id: string, name: string) {
  sort.value = id
  if (id === 'title.en') {
        sortDirection.value = 'asc';
    } else {
        sortDirection.value = 'desc';
    }
}

function toggle() {
  checked.value = !checked.value
}
</script>

<template>
  <div class="relative flex w-full text-sm">
    <div
      class="
        relative z-50 inline-flex cursor-pointer rounded-full rounded-r-none border
        bg-surface
        md:w-56 hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)]
      "
    >
      <button
        aria-haspopup="listbox"
        class="z-20 flex flex-auto items-center justify-between px-3 py-2 font-light"
        @click="toggleDropdown"
      >
        {{ selectedOption }}
        <i class="icon-[ph--caret-down] text-xs text-surface-text" />
      </button>

      <div
        v-if="showDropdown"
        class="
          dropdown absolute top-full z-10 max-h-[200px] w-full rounded-md border
          bg-surface-0 py-3 text-surface-800 shadow-md
          dark:border dark:border-surface-700 dark:bg-surface-800
          dark:text-white/80
        "
      >
        <ul
          v-for="option in sortOptions"
          :key="option.id"
          :value="option.id"
          tabindex="0"
          @keydown.enter="selectOption(option.id, option.name)"
        >
          <li
            class="
              dark:bg-primary-400/40 dark:text-white/80
              text-primary-700 m-0 cursor-pointer px-5 py-3 leading-none
              font-light
              hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)]
            "
            :class="{ 'bg-blue-400/20': option.id === sort }"
            @click="selectOption(option.id)"
          >
            {{ option.name }}
          </li>
        </ul>
      </div>
    </div>

    <button
      class="
        flex cursor-pointer items-center rounded-full rounded-l-none border
        border-surface-200 bg-surface pr-4 pl-3 font-light
        hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)]
      "
      @click="toggle"
    >
      <i
        :class="sortDirectionClass"
        class="!text-xs"
      />
      {{
        checked
          ? t('kdw.components.sort-split-button.SortSplitButton.toggleButton.ascending')
          : t('kdw.components.sort-split-button.SortSplitButton.toggleButton.descending')
      }}
    </button>
  </div>
</template>

<style scoped>
.dropdown {
  top: 50%;
}
</style>
