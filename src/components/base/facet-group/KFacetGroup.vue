<script lang="ts" setup>
import type { Facet } from '../../../utils/types'
import { useDataTruncator } from '@/composables/useDataTruncator'
import { ref } from 'vue'
import PhCaretDown from '~icons/ph/caret-down'
import Typography from '../typography/Typography.vue'

const props = defineProps<{
  title?: string
  facets: Facet[]
}>()

defineSlots<{
  header: (props: { title?: string }) => any
}>()

const model = defineModel<string[]>()
const collapsed = ref(false)

const {
  data: truncatedFacets,
  toggle: toggleFacetsTruncation,
  isTruncated,
  isTruncationNeeded,
} = useDataTruncator<Facet>({
  data: props.facets,
  limit: 5,
})
</script>

<template>
  <div
    class="flex min-w-64 flex-col rounded-custom bg-surface text-surface-text"
  >
    <div
      class="
        flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-4
        pr-6
      "
      @click="collapsed = !collapsed"
    >
      <slot
        name="header"
        :title="props?.title"
      >
        <Typography
          variant="by-heading-5"
          class="flex flex-row justify-between text-surface-text"
        >
          {{ title }}
        </Typography>
      </slot>
      <button>
        <PhCaretDown
          class="
            text-lg font-semibold transition-transform duration-200 ease-in-out
          "
          :class="{ 'rotate-180': !collapsed }"
        />
      </button>
    </div>
    <div v-if="!collapsed" class="flex-1">
      <ul class="flex flex-col divide-y border-neutral-20">
        <li
          v-for="(facet, i) in truncatedFacets"
          :key="i"
        >
          <label class="relative">
            <input
              :id="facet.id"
              v-model="model"
              class="peer absolute top-0 left-0 size-0 opacity-0"
              type="checkbox"
              :value="facet.id"
              :name="facet.label"
            >
            <div
              class="
                max-h-12 w-full px-4 py-3 pr-6
                peer-focus-visible:ring-2 peer-focus-visible:ring-black
              "
              :class="{
                'text-surface-text hover:bg-neutral-20': !model?.includes(facet.id),
                'border-b border-b-primary bg-primary-light font-semibold': model?.includes(facet.id),
              }"
              :name="facet.label"
              :value="facet.value || facet.id"
            >
              <div
                class="
                  flex flex-1 cursor-pointer flex-row flex-nowrap items-center
                  justify-between text-surface-text
                "
              >
                <div class="truncate">
                  {{ facet.label }}
                </div>
                <Typography
                  class="text-fg-muted font-normal"
                  as="div"
                  variant="button-text"
                >
                  {{ facet.count }}
                </Typography>
              </div>
            </div>
            </input>
          </label>
        </li>
        <li v-if="isTruncationNeeded">
          <button
            class="
              grid max-h-12 w-full cursor-pointer place-content-center
              rounded-b-lg border-t-0 bg-surface px-4 py-3 pr-6
            " @click="toggleFacetsTruncation"
          >
            <i v-if="isTruncated" class="icon-[ph--caret-down]" />
            <i v-else class="icon-[ph--caret-up]" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>
