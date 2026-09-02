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
  hoverBorderClass: 'hover:border-b-primary',
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
  hoverBorderClass?: string
}

const computedWrapperComponent = computed(() => {
  return props.ghost ? 'div' : props.href ? 'a' : 'router-link'
})
</script>

<template>
  <component
    :is="computedWrapperComponent"
    :to="props.to || '/'"
    :class="[
      'group by relative mx-auto mb-6 box-border w-full rounded-dali-md border border-b-[3px] border-transparent bg-surface px-6 py-5 text-surface-text',
      props.hoverBorderClass,
    ]"
  >
    <!-- Header -->
    <div class="flex flex-col gap-by3">
      <div class="flex items-center justify-between gap-4">
        <Typography v-if="title || id" variant="header-4" class="min-w-0">
          {{ title || id }}
        </Typography>
        <slot name="title-badge" />
      </div>
      <div
        class="
          flex flex-col gap-6
          lg:gap-12
        "
      >
        <slot name="body">
          <div
            class="
              grid grid-cols-12 gap-y-12
              lg:gap-x-6
            "
          >
            <!-- Description -->
            <div
              class="
                col-span-12 line-clamp-6 max-w-full overflow-hidden text-sm
                break-words text-surface-light
                lg:col-span-9
              "
            >
              <div class="markdown-content" v-html="description" />
            </div>
            <slot name="sidebar">
              <!-- File Format Tags -->
              <SummaryBox
                v-if="fileFormats.length > 0"
                class="
                  col-span-12 text-xs
                  md:mt-0
                  lg:col-span-3
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
          v-if="properties && properties.length > 0"
          class="grid grid-cols-12 gap-x-6 gap-y-4"
        >
          <div
            v-for="(value, key) in properties"
            :key="key"
            class="
              col-span-12 overflow-x-hidden
              md:col-span-6
              lg:col-span-3
            "
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
