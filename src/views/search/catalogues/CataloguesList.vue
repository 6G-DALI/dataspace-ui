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

// Keep "staging" catalogues at the bottom, everything else on top. The sort is
// stable, so the original order is preserved within each group.
const isStaging = (c: any) => /staging/i.test(c?.getId ?? '') || /staging/i.test(c?.getTitle ?? '')
const sortedCatalogues = computed(() =>
  [...(props.catalogues ?? [])].sort((a, b) => Number(isStaging(a)) - Number(isStaging(b))),
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
