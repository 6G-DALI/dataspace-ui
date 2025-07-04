<template>
  <nav>
    <!-- Linked Data link-->
    <div class="relative">
      <div class="text-nowrap cursor-pointer underline">
        <span
          :title="$t('footer.links.linkedData')"
          data-toggle="tooltip"
          @click="toggleDropdown">
          {{ $t('footer.links.linkedData') }}
          <i class="icon-[ph--caret-down] text-xs align-middle" />
        </span>
      </div>
      <div
        v-if="showDropdown"
        class="absolute z-10 w-full top-full border dark:border rounded-md shadow-md bg-surface-0 dark:bg-surface-800 text-surface-800 dark:text-white/80 dark:border-surface-700 max-h-[200px]">
        <resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item"
          format="rdf"
          text="RDF/XML"
          resources="datasets"
          v-bind:resources-id="datasetId"></resource-details-linked-data-button>
        <resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item"
          format="ttl"
          text="Turtle"
          resources="datasets"
          v-bind:resources-id="datasetId"></resource-details-linked-data-button>
        <resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item"
          format="n3"
          text="Notation3"
          resources="datasets"
          v-bind:resources-id="datasetId"></resource-details-linked-data-button>
        <resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item"
          format="nt"
          text="N-Triples"
          resources="datasets"
          v-bind:resources-id="datasetId"></resource-details-linked-data-button>
        <resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item"
          format="jsonld"
          text="JSON-LD"
          resources="datasets"
          v-bind:resources-id="datasetId"></resource-details-linked-data-button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { defineAsyncComponent } from 'vue'

const ResourceDetailsLinkedDataButton = defineAsyncComponent(() => import('./ResourceDetailsLinkedDataButton.vue'))

const props = defineProps({
  datasetId: {
    type: String,
    required: true,
  },
})

const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}
</script>

<style>
.dropdown-item :hover {
  background: var(--gray-hover);
}
</style>
