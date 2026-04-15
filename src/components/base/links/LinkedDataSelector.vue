<template>
  <details>{{ props.showDropdown }}</details>
  <nav>
    <!-- Linked Data link-->
    <div class="relative" :class="{ 'distributionButton': indist, 'active': showDropdown }">
      <button :class="buttonClass" @click="$emit('toggle')" aria-haspopup="listbox">
        <span :title="$t('footer.links.linkedData')" data-toggle="tooltip">
          {{ $t('footer.links.linkedData') }}
          <i class="icon-[ph--caret-down] text-xs align-middle mb-1" />
        </span>
      </button>
      <div v-if="showDropdown"
        class="absolute z-10 w-full top-full border dark:border rounded-md shadow-md bg-surface-0 dark:bg-surface-800 text-surface-800 dark:text-white/80 dark:border-surface-700 max-h-[200px] p-1">
        <ul class="w-full">
          <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer">
            <resource-details-linked-data-button isTooltip="true" class="dropdown-item w-full block" format="rdf"
              text="RDF/XML" :resources="resource"
              v-bind:resources-id="resourceId"></resource-details-linked-data-button></li>
          <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer">
            <resource-details-linked-data-button isTooltip="true" class="dropdown-item w-full block" format="ttl"
              text="Turtle" :resources="resource"
              v-bind:resources-id="resourceId"></resource-details-linked-data-button>
          </li>
          <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer">
            <resource-details-linked-data-button isTooltip="true" class="dropdown-item w-full block" format="n3"
              text="Notation3" :resources="resource"
              v-bind:resources-id="resourceId"></resource-details-linked-data-button></li>
          <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer">
            <resource-details-linked-data-button isTooltip="true" class="dropdown-item w-full block" format="nt"
              text="N-Triples" :resources="resource"
              v-bind:resources-id="resourceId"></resource-details-linked-data-button>
          </li>
          <li class="w-full hover:bg-[var(--surface-100)] dark:hover:bg-[var(--surface-700)] p-1 cursor-pointer">
            <resource-details-linked-data-button isTooltip="true" class="dropdown-item w-full block" format="jsonld"
              text="JSON-LD" :resources="resource"
              v-bind:resources-id="resourceId"></resource-details-linked-data-button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { log } from 'console'
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
  },
  indist: {
    type: Boolean
  },
  showDropdown:{}
})

const ResourceDetailsLinkedDataButton = defineAsyncComponent(() => import('./ResourceDetailsLinkedDataButton.vue'))

// const showDropdown = ref(false)
const emit = defineEmits(['toggle'])
function toggleDropdown() {
    const elements = document.querySelectorAll('.distributionButton')
  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    console.log(element);
    
   element.classList.remove("active");
   
  }


  // showDropdown.value = !showDropdown.value
}

</script>


<style lang="scss">
.dropdown-item :hover {
  background: var(--gray-hover);
}

.distributionButton {
  button {
    position: relative;
    z-index: 10;
  }

  div {
    padding-top: 16%;
    top: 50%;
    z-index: 5;
  }
}
</style>
