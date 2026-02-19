<script setup lang="ts">
import SearchInfoPanel from '@/components/base/search-info-panel/SearchInfoPanel.vue'
import FacetSidebar from '@/components/facet-sidebar/FacetSidebar.vue'
import SelectedFacetsOverview from '@/components/selected-facets-overview/SelectedFacetsOverview.vue'
import { useDcatApCatalogSearch } from '@/sdk'
import CataloguesList from '@/views/search/catalogues/CataloguesList.vue'
import FacetBurgerButton from '@/views/search/FacetBurgerButton.vue'
import SearchBar from '@/views/search/SearchBar.vue'
import { ref, toRef } from 'vue'
import { useI18n } from 'vue-i18n'
import PhXCircle from '~icons/ph/x-circle'
import { useSearchParams } from '../useSearchParams'
import { useSelectedFacetsCatalog } from '../useSelectedFacets'
import { useCatalogs } from './useCatalogs'

const { t } = useI18n()

const searchInput = defineModel<string>('searchInput', { required: true })
const hvdModel = defineModel<boolean>('hvd', { required: true })
const livedataModel = defineModel<boolean>('livedata', { required: true })
const selectedFacets = toRef(useSelectedFacetsCatalog())
const searchParams = useSearchParams()
const page = defineModel<number>('page', { required: true })
const sidebarVisible = ref(false)

function toggleFacetSidebar() {
  sidebarVisible.value = !sidebarVisible.value
}

const {
  availableFacetsFormatted,
  sort,
  sortDirection,
  catalogues,
  getSearchResultsCount,
  getSearchResultsPagesCount,
  isLoading,
  isFetching,
  showOnlyPublic,
  doSearch,
} = useCatalogs({
  isPublic: true,
  searchInput,
  hvdModel,
  livedataModel,
  selectedFacets,
  searchParams,
  hubSearchQueryDefinition: useDcatApCatalogSearch,
})
</script>

<template>
  <!-- Facets toggle sidebar for small devices -->
  <div
    v-if="sidebarVisible"
    class="fixed inset-0 z-50 flex"
  >
    <div
      class="absolute inset-0 bg-black/70"
      @click="toggleFacetSidebar"
    />

    <div
      class="
        bg-hite relative z-10 max-w-80 overflow-auto bg-white p-4 shadow-xl
      "
    >
      <header class="flex justify-between text-lg font-bold">
        {{ t('catalogues.searchFilter') }}
        <PhXCircle class="cursor-pointer text-xl" @click="toggleFacetSidebar" />
      </header>
      <FacetSidebar
        v-model:model-value="selectedFacets"
        v-model:hvd="hvdModel"
        v-model:livedata="livedataModel"
        :public="true"
        mobile
        :facets="availableFacetsFormatted"
      />
    </div>
  </div>
  <div
    class="
      relative container mx-auto flex flex-col px-2
      md:flex-row md:gap-x-16
    "
  >
    <!-- Permanent facets for large devices -->
    <div
      name="sidebar"
      class="
        relative hidden
        md:block md:w-80 md:flex-shrink-0
        lg:w-90
      "
    >
      <div
        name="stickysidey"
        class="sticky top-0 h-screen"
      >
        <FacetSidebar
          v-model:model-value="selectedFacets"
          v-model:hvd="hvdModel"
          v-model:livedata="livedataModel"
          :public="true"
          mobile
          :facets="availableFacetsFormatted"
        />
      </div>
    </div>
    <div
      name="content"
      class="flex min-w-0 flex-1 flex-col"
    >
      <FacetBurgerButton
        class="md:hidden"
        :open-sidebar="toggleFacetSidebar"
      />
      <SearchBar
        v-model="searchInput"
        :search-action="doSearch"
      />
      <div class="flex-1">
        <section
          name="datasets"
          class="mb-10 flex flex-col gap-6"
        >
          <SelectedFacetsOverview
            v-model="selectedFacets"
            :facets="availableFacetsFormatted"
          />
          <div class="flex flex-col gap-6">
            <SearchInfoPanel
              v-model:direction="sortDirection"
              v-model:sort="sort"
            >
              {{ getSearchResultsCount }} {{ t('catalogues.count') }}
            </SearchInfoPanel>
          </div>
          <CataloguesList
            :catalogues="catalogues"
            :get-search-results-pages-count="getSearchResultsPagesCount"
            :is-loading="isLoading"
            :is-fetching="isFetching"
            :show-only-public="showOnlyPublic"
          />
        </section>
      </div>
    </div>
  </div>
</template>
