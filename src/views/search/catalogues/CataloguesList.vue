<script setup lang="ts">
import SearchItems from '@/views/search/SearchItems.vue'
import { computed } from 'vue'
import CataloguesListItem from './CataloguesListItem.vue'

const props = defineProps<{
  catalogues: []
  getSearchResultsPagesCount: number
  isLoading: boolean
  isFetching: boolean
  showOnlyPublic: boolean
}>()

// Keep "6g-external" always last, "staging" catalogues directly above it,
// everything else on top. The sort is stable, so the original order is
// preserved within each group.
const isStaging = (c: any) => /staging/i.test(c?.getId ?? '') || /staging/i.test(c?.getTitle ?? '')
const is6gExternal = (c: any) => (c?.getId ?? '').toLowerCase() === '6g-external'
const rank = (c: any) => is6gExternal(c) ? 2 : isStaging(c) ? 1 : 0
const sortedCatalogues = computed(() =>
  [...(props.catalogues ?? [])].sort((a, b) => rank(a) - rank(b)),
)
</script>

<template>
  <SearchItems
    :items="sortedCatalogues"
    :get-search-results-pages-count="getSearchResultsPagesCount"
    :is-loading="isLoading"
    :is-fetching="isFetching"
    :show-only-public="showOnlyPublic"
    container-class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
  >
    <template #default="{ item }">
      <CataloguesListItem
        :item="item"
      />
    </template>
  </SearchItems>
</template>
