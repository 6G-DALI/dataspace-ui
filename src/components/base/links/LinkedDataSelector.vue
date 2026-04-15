<template>
  <nav>
    <!-- Linked Data link-->
    <div class="relative">
      <button 
        :class="buttonClass" 
        @click="toggleDropdown" 
        aria-haspopup="listbox"
      >
        <span
          :title="$t('footer.links.linkedData')"
          data-toggle="tooltip">
          {{ $t('footer.links.linkedData') }}
          <i class="icon-[ph--caret-down] text-xs align-middle mb-1" /> 
        </span>
      </button>
      <div
        v-if="showDropdown"
        class="absolute z-10 w-full top-full border dark:border rounded-md shadow-md bg-surface-0 dark:bg-surface-800 text-surface-800 dark:text-white/80 dark:border-surface-700 max-h-[200px]">
        <ul class="w-full">
          <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer" ><resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item w-full block"
          format="rdf"
          text="RDF/XML"
          :resources="resource"
          v-bind:resources-id="resourceId"></resource-details-linked-data-button></li>
          <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer"><resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item w-full block"
          format="ttl"
          text="Turtle"
          :resources="resource"
          v-bind:resources-id="resourceId"></resource-details-linked-data-button>
          </li>
          <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer"><resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item w-full block"
          format="n3"
          text="Notation3"
          :resources="resource"
          v-bind:resources-id="resourceId"></resource-details-linked-data-button></li>
        <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer">
          <resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item w-full block"
          format="nt"
          text="N-Triples"
          :resources="resource"
          v-bind:resources-id="resourceId"></resource-details-linked-data-button>
        </li>
        <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer">
          <resource-details-linked-data-button
          isTooltip="true"
          class="dropdown-item w-full block"
          format="jsonld"
          text="JSON-LD"
          :resources="resource"
          v-bind:resources-id="resourceId"></resource-details-linked-data-button>
        </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'

const props = defineProps({
  resourceId: {
    type: String,
    required: true,
  },
  resource: {
    type: String,
  },
  buttonClass: {
      type: String,
    }
})

const ResourceDetailsLinkedDataButton = defineAsyncComponent(() => import('./ResourceDetailsLinkedDataButton.vue'))

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
