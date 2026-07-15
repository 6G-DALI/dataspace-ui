<script setup lang="ts">
import { useDataTruncator } from '@/composables/useDataTruncator'

import { computed, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import PhCaretLeft from '~icons/ph/caret-left'

import KButton from '../base/button/KButton.vue'

import LinkedDataSelector from '../base/links/LinkedDataSelector.vue'

import TabGroup from '../base/tab-group/TabGroup.vue'
import KTag from '../base/tag/KTag.vue'
import Typography from '../base/typography/Typography.vue'

import DistributionCard from '../distribution-card/DistributionCard.vue'

import DetailsPageHeader from './DetailsPageHeader.vue'

import DatasetsOverview from './DatasetsOverview.vue'

const props = withDefaults(defineProps<{
  headline?: string
  title?: string
  subtitle?: string
  datasetId: string
  descriptionMarkup?: string
  distributions?: any[]
}>(), {
  headline: 'Datensatz',
  distributions: () => [],
})

const { t } = useI18n()


const router = useRouter()

const { data: truncatedDescription, toggle: toggleDescription, isTruncated: isDescriptionTruncated, isTruncationNeeded: isDescriptionTruncationNeeded } = useDataTruncator({
  data: computed(() => props.descriptionMarkup || ''),
  limit: 550,
})

const truncatedEllipsedDescription = computed(() => {
  if (toValue(isDescriptionTruncated)) {
    return `${truncatedDescription.value}...`
  }
  return truncatedDescription.value
})

// Distribution truncator ("show more")
const {
  data: truncatedFormattedDistributions,
  toggle: showAllDistributions,
  isTruncated: isDistributionsTruncated,
} = useDataTruncator({
  data: computed(() => props.distributions),
  limit: 7,
})

const showBack = computed(() => {
  return !!router.options.history.state?.back
})
</script>

<template>
  <div class="container mx-auto">
    <div class="mx-auto w-full space-y-6">
      <section name="dsd-header" class="flex flex-col gap-6">
        <div class="flex flex-col gap-6">
          <div class="flex justify-between">
            <div>
              <button v-if="showBack" class="mt-[14px] 2xl:-ml-[1.7em] cursor-pointer py-1" @click="router.back()">
                <Typography variant="paragraph-1" class="
                    flex items-center gap-2 text-primary
                    hover:text-primary-hover
                  ">
                  <PhCaretLeft />
                  <span>{{ t('details.back') }}</span>
                </Typography>
              </button>
            </div>
            <LinkedDataSelector :resource-id="datasetId" resource="datasets" class="mt-4" />
          </div>
          <div class="flex items-center justify-between">
            <DetailsPageHeader :headline="headline" :title="title" :subtitle="subtitle">
              <template #subtitle>
                <slot name="subtitle" :subtitle="subtitle">
                  <span>{{ subtitle }}</span>
                </slot>
              </template>
            </DetailsPageHeader>
          </div>
        </div>
      </section>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>