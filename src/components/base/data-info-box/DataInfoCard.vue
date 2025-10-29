<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SummaryBox from '../summary-box/SummaryBox.vue'
import KTag from '../tag/KTag.vue'
import Typography from '../typography/Typography.vue'

const props = withDefaults(defineProps<DataInfoCardProps>(), {
  fileFormats: () => [],
  properties: () => [],
})

const { t } = useI18n()

interface Summary {
  title: string
  text: string
}

interface DataInfoCardProps {
  id?: string
  title?: string
  description?: string
  fileFormats?: string[]
  ghost?: boolean
  href?: string
  to?: RouteLocationRaw
  properties?: Summary[]
}

const computedWrapperComponent = computed(() => {
  return props.ghost ? 'div' : props.href ? 'a' : 'router-link'
})
</script>

<template>
  <component
    :is="computedWrapperComponent"
    :to="props.to || '/'"
    class="
      group by relative mx-auto mb-6 box-border w-full rounded-custom border
      border-b-[3px] border-transparent bg-surface px-6 py-5 text-surface-text
      hover:border-b-primary
    "
  >
    <!-- Header -->
    <div class="flex flex-col gap-by3">
      <Typography v-if="title || id" variant="header-4">
        {{ title || id }}
      </Typography>
      <div class="flex flex-col gap-5">
        <slot name="body">
          <div class="grid grid-cols-12 gap-2">
            <!-- Description -->
            <div class="col-span-12 line-clamp-6 text-surface-light lg:col-span-8 break-words overflow-hidden max-w-full text-sm">
               <div class="markdown-content" v-html="description" />
            </div>
            <slot name="sidebar">
              <!-- File Format Tags -->
              <SummaryBox
                v-if="fileFormats.length > 0"
                class="
                  col-span-12 mt-6
                  md:mt-0
                  lg:col-span-4 lg:ml-10 text-xs
                "
                :title="t('search.file-formats')"
              >
                <template #text>
                  <div class="flex flex-wrap gap-2">
                    <KTag
                      v-for="format in fileFormats"
                      :key="format"
                    >
                      {{ format }}
                    </KTag>
                  </div>
                </template>
              </SummaryBox>
            </slot>
          </div>
        </slot>
        <!-- Metadata Grid -->
        <div
          v-if="properties && properties.length > 0" class="flex flex-row gap-6"
        >
          <div
            v-for="(value, key) in properties"
            :key="key" class="flex-1 overflow-x-hidden"
          >
            <SummaryBox class="max-w-full" :title="value.title" :text="value.text || '-'" truncate />
          </div>
        </div>
        <div
          v-if="props.ghost"
          class="absolute top-0 left-0 size-full bg-white"
        >
          <div class="size-full animate-pulse bg-slate-200" />
        </div>
      </div>
    </div>
  </component>
</template>
