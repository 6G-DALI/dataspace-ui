<script setup lang="ts">
import type { DatasetType } from '@/utils/types'
import type { RouteLocationRaw } from 'vue-router'
import KTag from '@/components/base/tag/KTag.vue'
import Typography from '@/components/base/typography/Typography.vue'
import { computed } from 'vue'

const props = defineProps<{
  title?: string
  text?: string
  formats?: string[]
  categories?: string[]
  issued?: string
  to?: RouteLocationRaw
  href?: string
  ghost?: boolean
  datasetType?: DatasetType
}>()

const computedWrapperComponent = computed(() => {
  return props.ghost ? 'div' : props.href ? 'a' : 'router-link'
})
</script>

<template>
  <component
    :is="computedWrapperComponent"
    :to="props.to || '/'"
    class="
      focus:ring-primary-400/50 focus:ring-3 focus:outline-hidden
      focus:outline-offset-0
      group border-bg-divider relative flex cursor-pointer gap-8 rounded-lg
      border bg-white p-4 text-clip transition-colors
      hover:bg-bg-darker
    "
  >
    <div>
      <div class="flex-1">
        <slot>
          <div class="flex flex-col gap-6 text-content">
            <div class="w-full flex-1">
              <Typography
                as="h3"
                variant="header-3"
                class="
                  text-primary-800
                  group-hover:underline
                "
              >
                {{ props.title }}
              </Typography>
            </div>
            <div class="flex flex-wrap gap-2">
              <KTag
                v-for="category in props.categories"
                :key="category"
                outline
              >
                {{ category }}
              </KTag>
            </div>
          </div>
        </slot>
      </div>
    </div>
    <div
      v-if="props.ghost"
      class="absolute top-0 left-0 size-full bg-white"
    >
      <div class="size-full animate-pulse bg-slate-200" />
    </div>
  </component>
</template>
