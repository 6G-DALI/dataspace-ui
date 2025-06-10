<script setup lang="ts">
import { computed } from 'vue'
import { useDataTruncator } from '../../composables/useDataTruncator'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps<{
  data: any[] | string
}>()

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
  <div class="flex flex-col gap-4">
    <slot :truncated="truncated" :is-expanded="isExpanded">
      {{ truncated }}
    </slot>
    <span class="by-link cursor-pointer ">
      <button class="inline-flex min-w-fit flex-row items-center gap-2 cursor-pointer" @click="handleToggle">
        <slot name="label" :is-expanded="isExpanded">
          <span>{{ toggleText }}</span>
        </slot>
        <i :class="toggleIcon" />
      </button>
    </span>
  </div>
</template>
