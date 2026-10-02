<script setup lang="ts">
import DataInfoCard from '@/components/base/data-info-box/DataInfoCard.vue'
import { computed } from 'vue'
import appConfig from '../../../config/appConfig'
import { useSearchParams } from './useSearchParams'

/* ── Resource type resolver — based on content, not catalogue ───────── */
type ResourceType = 'dataset' | 'service' | 'model'

const servicesCatalogue = appConfig.servicesCatalogue || '6g-dali-services'
const modelsCatalogue   = appConfig.modelsCatalogue   || '6g-dali-models'

function getResourceType(item: any): ResourceType {
  // Callers disagree on the field name: DatasetDetailsView.vue passes the raw
  // enhanced search result (getCatalogId), while useDatasetsSearchView.ts
  // remaps it to catalogueId before handing items to this component — check
  // both rather than pick one and break the other caller.
  const catalogId = item.getCatalogId ?? item.catalogueId
  if (catalogId === servicesCatalogue) return 'service'
  if (catalogId === modelsCatalogue)   return 'model'
  return 'dataset'
}

const RESOURCE_STYLE: Record<ResourceType, { border: string, hover: string, pill: string, label: string }> = {
  dataset: {
    border: 'border-l-4 !border-l-[var(--secondary)]',
    hover:  'hover:border-b-[var(--secondary)]',
    pill:   'bg-[var(--secondary)]',
    label:  'Dataset',
  },
  service: {
    border: 'border-l-4 !border-l-indigo-500',
    hover:  'hover:border-b-indigo-500',
    pill:   'bg-indigo-600',
    label:  'Data Processing Service',
  },
  model: {
    border: 'border-l-4 !border-l-purple-500',
    hover:  'hover:border-b-purple-500',
    pill:   'bg-purple-600',
    label:  'ML Model',
  },
}

/* ── Service type sub-badge colours ─────────────────────────────────── */
const SERVICE_TYPE_COLOURS: Record<string, { bg: string, text: string, border: string }> = {
  QualityCheck:          { bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-200'  },
  Transformation:        { bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-200'   },
  Augmentation:          { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  Aggregation:           { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  Anonymisation:         { bg: 'bg-pink-50',   text: 'text-pink-800',   border: 'border-pink-200'   },
  'Feature Engineering': { bg: 'bg-teal-50',   text: 'text-teal-800',   border: 'border-teal-200'   },
}

function serviceTypeStyle(type: string) {
  return SERVICE_TYPE_COLOURS[type] || { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-200' }
}

const props = withDefaults(defineProps<{
  items: []
  getSearchResultsPagesCount: number
  isLoading: boolean
  isFetching: boolean
  showOnlyPublic: boolean
  /** Tailwind classes for the items container. Defaults to a single column. */
  containerClass?: string
}>(), {
  containerClass: 'flex flex-col gap-2',
})

const searchParams = useSearchParams()
const backendPage = searchParams.queryParams.page
const currentPage = computed(() => backendPage.value + 1)
const itemsCount = computed(() => searchParams?.queryParams?.limit ?? 10)
const totalPages = computed(() => Math.ceil(props.getSearchResultsPagesCount))
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
    backendPage.value = page - 1
  }
}
</script>

<template>
  <div :class="containerClass">
    <template v-if="!isLoading && !isFetching">
      <slot v-for="item in items" :key="item.id" :item="item">

        <!-- Data Processing Service card -->
        <DataInfoCard
          v-if="getResourceType(item) === 'service'"
          :to="{ name: 'dataset-details', params: { datasetId: item.id } }"
          :title="item.title"
          :description="item?.getDescriptionMarkup"
          :hover-border-class="RESOURCE_STYLE.service.hover"
          :class="RESOURCE_STYLE.service.border"
        >
          <template #title-badge>
            <div class="flex shrink-0 items-center gap-2">
              <span class="inline-flex items-center gap-1.5 rounded-full bg-indigo-600 px-3 py-0.5 text-xs font-semibold text-white">
                <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clip-rule="evenodd"/>
                </svg>
                Data Processing Service
              </span>
              <span
                v-if="item.summary?.find(s => s.title === 'Service Type')?.text"
                :class="[
                  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
                  serviceTypeStyle(item.summary.find(s => s.title === 'Service Type').text).bg,
                  serviceTypeStyle(item.summary.find(s => s.title === 'Service Type').text).text,
                  serviceTypeStyle(item.summary.find(s => s.title === 'Service Type').text).border,
                ]"
              >
                {{ item.summary.find(s => s.title === 'Service Type').text }}
              </span>
            </div>
          </template>
          <template #body>
            <div class="flex flex-col gap-4">
              <div class="line-clamp-3 text-sm text-surface-light break-words">
                <div class="markdown-content" v-html="item.getDescriptionMarkup" />
              </div>
              <div v-if="item.summary?.length" class="grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
                <div v-for="prop in item.summary.filter(s => s.title !== 'Service Type')" :key="prop.title">
                  <div class="font-medium text-gray-500">{{ prop.title }}</div>
                  <div class="truncate text-gray-800 dark:text-white">{{ prop.text || '—' }}</div>
                </div>
              </div>
            </div>
          </template>
        </DataInfoCard>

        <!-- Regular dataset card -->
        <DataInfoCard
          v-else
          :to="{ name: 'dataset-details', params: { datasetId: item.id } }"
          :title="item.title"
          :description="item?.getDescriptionMarkup"
          :file-formats="item.formats"
          :properties="item.summary"
          :hover-border-class="RESOURCE_STYLE[getResourceType(item)].hover"
          :class="RESOURCE_STYLE[getResourceType(item)].border"
        >
          <template #title-badge>
            <span
              class="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold text-white"
              :class="RESOURCE_STYLE[getResourceType(item)].pill"
            >
              <svg class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path d="M3 12v3c0 1.657 3.134 3 7 3s7-1.343 7-3v-3c0 1.657-3.134 3-7 3s-7-1.343-7-3z"/>
                <path d="M3 7v3c0 1.657 3.134 3 7 3s7-1.343 7-3V7c0 1.657-3.134 3-7 3S3 8.657 3 7z"/>
                <path d="M17 5c0 1.657-3.134 3-7 3S3 6.657 3 5s3.134-3 7-3 7 1.343 7 3z"/>
              </svg>
              {{ RESOURCE_STYLE[getResourceType(item)].label }}
            </span>
          </template>
        </DataInfoCard>

      </slot>
    </template>
    <template v-else>
      <div
        v-for="i in itemsCount.value" :key="i" class="
          flex size-full animate-pulse flex-col gap-6 rounded-dali-md bg-slate-200
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
          <i class="icon-[ph--caret-double-left] align-middle text-xs" :class="{ 'color-purple-300': currentPage === 1 }" />
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
