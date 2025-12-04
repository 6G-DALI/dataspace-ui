<script setup lang="ts">
import { useDataTruncator } from '@/composables/useDataTruncator'
import { computed, ref, toValue } from 'vue'

import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import PhCaretLeft from '~icons/ph/caret-left'

import LinkedDataSelector from '../base/links/LinkedDataSelector.vue'

import SummaryBox from '../base/summary-box/SummaryBox.vue'

import TabGroup from '../base/tab-group/TabGroup.vue'

import Typography from '../base/typography/Typography.vue'

import DetailsPageHeader from './DetailsPageHeader.vue'
import DistributionCard from '../distribution-card/DistributionCard.vue'
import KTag from '../base/tag/KTag.vue'
import KButton from '../base/button/KButton.vue'

import DataQuality from '@/views/search/datasets/DataQuality.vue'

const props = withDefaults(defineProps<{
  headline?: string
  title?: string
  subtitle?: string
  datasetId: string
  summary?: { title: string, text: string }[]
  descriptionMarkup?: string
  distributions?: any[]
}>(), {
  headline: 'Datensatz',
  distributions: () => []
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

const showQualityPage = ref(false);
</script>

<template>
  <div class="container mx-auto px-8">
    <div class="mx-auto w-full max-w-content-max space-y-6">
      <section name="dsd-header" class="flex flex-col gap-6">
        <div class="flex flex-col gap-6">
          <div class="flex justify-between">
          <div>
            <button class="-ml-6 mt-[14px] px-4 py-1 cursor-pointer" @click="router.back()">
              <Typography variant="paragraph-1" class="flex items-center gap-2 text-primary hover:text-primary-hover">
                <PhCaretLeft />
                <span>{{ t('details.back') }}</span>
              </Typography>
            </button>
          </div>
          <LinkedDataSelector :resource-id="datasetId" resource="datasets" class="mt-4" />
          </div>
          <div class="flex justify-between items-center">
            <DetailsPageHeader :headline="headline" :title="title" :subtitle="subtitle">
            <template #subtitle>
              <slot name="subtitle" :subtitle="subtitle">
                <span>{{ subtitle }}</span>
              </slot>
            </template>
            </DetailsPageHeader>
            <KButton size="small" @click="showQualityPage = !showQualityPage">
              {{ showQualityPage ? t('details.overview') : t('details.quality') }}
            </KButton>
          </div>
        </div>
        <slot name="metadata">
          <div
            class="
              flex flex-col justify-between
              md:flex-row
            "
          >
            <SummaryBox
              v-for="(s, i) in summary" :key="i" class="mr-4 mb-4 flex-1" :title="s.title"
              :text="s.text || '-'"
            />
          </div>
        </slot>
      </section>
      <div v-if="showQualityPage">
        <DataQuality :id="props.datasetId"/>
      </div>
      <div v-else>
      <section>
        <TabGroup
          :tabs="[
            {
              id: 'dataset',
              title: t('details.info_tab'),
              content: truncatedEllipsedDescription || '',
            },
          ]" class=""
        >
          <template #default="{ id, content }">
            <template v-if="id === 'dataset'">
              <div class="flex flex-col gap-4">
                <div>
                  <Typography as="h5" variant="header-4" class="mb-2">
                    <slot name="about-this-dataset">
                      {{ t('details.about_dataset') }}
                    </slot>
                  </Typography>
                  <Typography as="p" variant="by-copy-small-regular">
                    <div class="markdown-content" v-html="content" />
                  </Typography>
                </div>
                <button
                  v-if="isDescriptionTruncationNeeded" class="
                    grid w-full place-content-center
                  "
                  @click="toggleDescription"
                >
                  <div
                    class="
                      flex flex-col items-center justify-center text-xs/6
                      font-bold text-primary
                    "
                  >
                    <span>{{ t('details.read_more') }}</span>
                    <i
                      v-if="isDescriptionTruncated" class="
                        icon-[ph--caret-down]
                      "
                    />
                    <i v-else class="icon-[ph--caret-up]" />
                  </div>
                </button>
              </div>
            </template>
          </template>
        </TabGroup>
      </section>
      <slot name="sections">
        <section v-if="distributions && distributions.length > 0" class="space-y-4">
          <div class="my-12 flex flex-row items-center gap-2">
            <h2 class="text-[2.5rem] font-bold leading-[3rem] text-primary-100">
              Distributionen
            </h2>
            <KTag interactive class="rounded-full bg-primary-90">
              {{ distributions?.length }}
            </KTag>
          </div>
          <div class="h-px w-full bg-bg-divider" />
          <div name="distribution-cards" class="relative">
            <template v-for="(distribution, i) in truncatedFormattedDistributions" :key="distribution.id">
              <div name="distribution-card-wrapper" class="relative">
                <DistributionCard
                  :title="distribution.title || ''"
                  :description="distribution.descriptionMarkup || ''"
                  :format="distribution.format || 'Unknown'"
                  :download-url="distribution.downloadUrls?.[0]!"
                  :last-updated="distribution.modified"
                  :data="distribution.data"
                  :linked-data="distribution.linkedData"
                  :distribution-id="distribution.id"
                  :download-text="'Download'"
                  :save-text="'Linked Data'"
                />
                <div
                  v-if="i === truncatedFormattedDistributions.length - 1 && isDistributionsTruncated"
                  name="distribution-card-overlay"
                  class="absolute left-0 top-0 size-full bg-linear-to-b from-transparent from-0% to-white to-55%"
                >
                  <div class="absolute bottom-0 flex w-full flex-row items-center justify-center">
                    <div>
                      <!--button-->
                      <button
                        class="
                          inline-flex items-center justify-center gap-2
                          px-4 py-2 text-sm font-medium text-white
                          bg-primary hover:bg-primary-hover active:bg-primary-pressed
                          rounded-full border-0 cursor-pointer
                          transition-colors duration-200
                        "
                        @click="showAllDistributions"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                          <path d="M247.31,124.76c-.35-.79-8.82-19.58-27.65-38.41C194.57,61.26,162.88,48,128,48S61.43,61.26,36.34,86.35C17.51,105.18,9,124,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208s66.57-13.26,91.66-38.34c18.83-18.83,27.3-37.61,27.65-38.4A8,8,0,0,0,247.31,124.76ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.47,133.47,0,0,1,25,128,133.33,133.33,0,0,1,48.07,97.25C70.33,75.19,97.22,64,128,64s57.67,11.19,79.93,33.25A133.46,133.46,0,0,1,231.05,128C223.84,141.46,192.43,192,128,192Zm0-112a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160Z"></path>
                        </svg>
                        <span>Mehr anzeigen ({{ distributions.length }})</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </template>
            <!-- Show Less-->
            <div v-if="!isDistributionsTruncated && distributions.length > 7" class="flex justify-center mt-4">
              <button
                class="
                  inline-flex items-center justify-center gap-2
                  px-4 py-2 text-sm font-medium text-white
                  bg-primary hover:bg-primary-hover active:bg-primary-pressed
                  rounded-full border-0 cursor-pointer
                  transition-colors duration-200
                "
                @click="showAllDistributions"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
                  <path d="M53.92,34.62A8,8,0,1,0,42.08,45.38L61.32,66.55C25,88.84,9.38,123.2,8.69,124.76a8,8,0,0,0,0,6.5c.35.79,8.82,19.57,27.65,38.4C61.43,194.74,93.12,208,128,208a127.11,127.11,0,0,0,52.07-10.83l22,24.21a8,8,0,1,0,11.84-10.76Zm47.33,75.84,41.67,45.85a32,32,0,0,1-41.67-45.85ZM128,192c-30.78,0-57.67-11.19-79.93-33.25A133.16,133.16,0,0,1,25,128c4.69-8.79,19.66-33.39,47.35-49.38l18,19.75a48,48,0,0,0,63.66,70l14.73,16.2A112,112,0,0,1,128,192Zm6-95.43a8,8,0,0,1,3-15.72,48.16,48.16,0,0,1,38.77,42.64,8,8,0,0,1-7.22,8.71,6.39,6.39,0,0,1-.75,0,8,8,0,0,1-8-7.26A32.09,32.09,0,0,0,134,96.57Zm113.28,34.69c-.42.94-10.55,23.37-33.36,43.8a8,8,0,1,1-10.67-11.92A132.77,132.77,0,0,0,231.05,128a133.15,133.15,0,0,0-23.12-30.77C185.67,75.19,158.78,64,128,64a118.37,118.37,0,0,0-19.36,1.57A8,8,0,1,1,106,49.79,134,134,0,0,1,128,48c34.88,0,66.57,13.26,91.66,38.35,18.83,18.83,27.3,37.62,27.65,38.41A8,8,0,0,1,247.31,131.26Z"></path>
                </svg>
                <span>Weniger anzeigen</span>
              </button>
            </div>
          </div>
        </section>
      </slot>
      </div>
    </div>
  </div>
</template>

