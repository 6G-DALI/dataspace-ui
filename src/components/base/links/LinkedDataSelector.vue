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
})

const ResourceDetailsLinkedDataButton = defineAsyncComponent(() => import('./ResourceDetailsLinkedDataButton.vue'))

const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}
</script>

<template>
  <nav>
    <!-- Linked Data link -->
    <div class="relative">
      <button class="cursor-pointer text-nowrap underline" aria-haspopup="listbox" @click="toggleDropdown">
        <span
          :title="$t('footer.links.linkedData')"
          data-toggle="tooltip"
        >
          {{ $t('footer.links.linkedData') }}
          <i class="icon-[ph--caret-down] align-middle text-xs" />
        </span>
      </button>
      <div
        v-if="showDropdown"
        class="
          absolute top-full z-10 max-h-[200px] w-full rounded-md border
          bg-surface-0 text-surface-800 shadow-md
          dark:border dark:border-surface-700 dark:bg-surface-800
          dark:text-white/80
        "
      >
        <ul class="w-full">
          <li
            class="
              w-full p-1
              hover:bg-gray
            "
          >
            <ResourceDetailsLinkedDataButton
              is-tooltip="true"
              class="dropdown-item w-full"
              format="rdf"
              text="RDF/XML"
              :resources="resource"
              :resources-id="resourceId"
            />
          </li>
          <li
            class="
              w-full p-1
              hover:bg-gray
            "
          >
            <ResourceDetailsLinkedDataButton
              is-tooltip="true"
              class="dropdown-item"
              format="ttl"
              text="Turtle"
              :resources="resource"
              :resources-id="resourceId"
            />
          </li>
          <li
            class="
              w-full p-1
              hover:bg-gray
            "
          >
            <ResourceDetailsLinkedDataButton
              is-tooltip="true"
              class="dropdown-item"
              format="n3"
              text="Notation3"
              :resources="resource"
              :resources-id="resourceId"
            />
          </li>
          <li
            class="
              w-full p-1
              hover:bg-gray
            "
          >
            <ResourceDetailsLinkedDataButton
              is-tooltip="true"
              class="dropdown-item"
              format="nt"
              text="N-Triples"
              :resources="resource"
              :resources-id="resourceId"
            />
          </li>
          <li
            class="
              w-full p-1
              hover:bg-gray
            "
          >
            <ResourceDetailsLinkedDataButton
              is-tooltip="true"
              class="dropdown-item"
              format="jsonld"
              text="JSON-LD"
              :resources="resource"
              :resources-id="resourceId"
            />
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>
.dropdown-item :hover {
  background: var(--gray-hover);
}
</style>
