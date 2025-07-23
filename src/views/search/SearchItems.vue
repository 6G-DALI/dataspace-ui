<script setup lang="ts">
import DataInfoCard from '@/components/base/data-info-box/DataInfoCard.vue'
import { computed, defineProps } from 'vue'
import { useSearchParams } from './useSearchParams'

const props = defineProps<{
  items: []
  getSearchResultsPagesCount: number
  isLoading: boolean
  isFetching: boolean
  showOnlyPublic: boolean
}>()

const searchParams = useSearchParams()
const currentPage = searchParams.queryParams.page
const itemsCount = computed(() => searchParams?.queryParams?.limit ?? 10)
const totalPages = computed(() => Math.ceil(props.getSearchResultsPagesCount) - 1)
const paginationRange = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const maxButtons = 5

  if (total <= maxButtons) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }

  let start = current - Math.floor(maxButtons / 2)
  let end = current + Math.floor(maxButtons / 2)

  if (start < 1) {
    start = 1
    end = maxButtons
  }
  else if (end > total) {
    end = total
    start = total - maxButtons + 1
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <template v-if="!isLoading && !isFetching">
      <slot v-for="item in items" :key="item.id" :item="item">
        <DataInfoCard
          :to="{ name: 'dataset-details', params: { datasetId: item.id } }"
          :title="item.title"
          :description="item.description"
          :file-formats="item.formats"
          :properties="item.summary"
        />
      </slot>
    </template>
    <template v-else>
      <div
        v-for="i in itemsCount.value" :key="i" class="
          flex size-full animate-pulse flex-col gap-6 rounded-3xl bg-slate-200
          text-content
        "
      >
        <div class="flex h-64 flex-wrap gap-2" />
      </div>
    </template>
  </div>
  <!-- Pagination -->
  <div class="grid w-full place-content-center">
    <nav class="rounded-sm">
      <div
        class="
          flex flex-wrap items-center justify-center rounded-xl bg-surface px-4
          py-2 text-primary
          dark:bg-surface-800 dark:text-white/60
        "
      >
        <button
          class="px-4 py-2"
          :class="{
            'opacity-60': currentPage === 1,
          }"
          @click="goToPage(1)"
        >
          <i class="icon-[ph--caret-double-left] align-middle text-xs" />
        </button>

        <button
          :class="{
            'opacity-60': currentPage === 1,
          }"
          class="px-4 py-2"
          @click="goToPage(currentPage - 1)"
        >
          <i class="icon-[ph--caret-left] align-middle text-xs" />
        </button>

        <button
          v-for="page in paginationRange"
          :key="page"
          class="
            m-[0.143rem] inline-flex h-12 min-w-[3rem] items-center
            justify-center rounded-full border-0
          "
          :class="{
            'dark:bg-primary-400/30 dark:text-surface-0 bg-primary text-white': page === currentPage,
            'text-primary-700 hover:bg-gray-hover dark:text-white/80': page !== currentPage,
          }"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>

        <button
          class="px-4 py-2"
          :class="{
            'opacity-60': currentPage === totalPages,
          }"
          @click="goToPage(currentPage + 1)"
        >
          <i class="icon-[ph--caret-right] align-middle text-xs" />
        </button>

        <button
          class="px-4 py-2"
          :class="{
            'opacity-60': currentPage === totalPages,
          }"
          @click="goToPage(totalPages)"
        >
          <i class="icon-[ph--caret-double-right] align-middle text-xs" />
        </button>
      </div>
    </nav>
  </div>
</template>
