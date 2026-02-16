<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDataTruncator } from '../../composables/useDataTruncator'

const props = defineProps<{
  data: any[] | string
}>()
const { t } = useI18n()
const expanded = defineModel<boolean>('expanded', { default: true })
const limit = defineModel<number>('limit', { default: Number.POSITIVE_INFINITY })

const { data: truncated, toggle } = useDataTruncator({
  data: (props.data as any[]),
  limit,
})

const isExpanded = computed(() => expanded.value)
const toggleIcon = computed(() => expanded.value ? 'icon-[ph--caret-up]' : 'icon-[ph--caret-down]')

function handleToggle() {
  expanded.value = !expanded.value
  toggle()
}
const toggleText = computed(() => isExpanded.value ? t('toggler.show_less') : t('toggler.show_more'))
</script>

<template>
  <div class="flex flex-col">
    <slot :truncated="truncated" :is-expanded="isExpanded">
      {{ truncated }}
    </slot>
    <span class="inline-block">
      <button
        class="by-link cursor-pointer inline-flex items-center gap-2 mb-5" 
        @click="handleToggle">
        <slot name="label" :is-expanded="isExpanded">
          <span>{{ toggleText }}</span>
        </slot>
        <i :class="toggleIcon" />
      </button>
    </span>
  </div>
</template>
