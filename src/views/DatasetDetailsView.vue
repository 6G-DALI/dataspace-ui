<script setup lang="ts">
import type { PropertyTableEntryNode } from '@piveau/sdk-vue'
import type { Ref } from 'vue'
import DetailsPage from '@/components/details-page/DetailsPage.vue'
import { useDataTruncator } from '@/composables/useDataTruncator'
import { useRouteParams } from '@vueuse/router'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'

import { computed, shallowReactive, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import KButton from '../components/base/button/KButton.vue'

import KCard from '../components/base/card/KCard.vue'
import KTag from '../components/base/tag/KTag.vue'
import Typography from '../components/base/typography/Typography.vue'
import DistributionCard from '../components/distribution-card/DistributionCard.vue'
import { PropertyTable } from '../components/property-table/PropertyTableRow'

import { useDcatApSearch } from '../sdk/index'

import { getLocalizedValue } from '../sdk/utils/helpers'

function ensureDatasetId(id: Ref): asserts id is Ref<string> {
  if (typeof toValue(id) !== 'string')
    throw new Error('id must be a string')
}

const router = useRouter()

const datasetId = useRouteParams('datasetId', '', {
  router,
  route: useRoute(),
})

ensureDatasetId(datasetId)

const { useResource: getDataset } = useDcatApSearch()

const { isSuccess, query, resultEnhanced } = shallowReactive(
  getDataset(datasetId),
)

const getFormattedDistributions = computed(() => {
  if (!isSuccess.value)
    return []
  if (!resultEnhanced.value?.getDistributions)
    return []

  return resultEnhanced.value.getDistributions.map((dist) => {
    return {
      title: dist.title ?? dist.id ?? '',
      description: dist.description ?? '',
      descriptionMarkup: DOMPurify.sanitize(marked(dist.description ?? '', { async: false })),
      downloadUrls: dist.accessUrls || [],
      format: dist.format ?? '',
      id: dist.id,
      accessUrls: dist.accessUrls,
      modified: dist.modified ?? '',
      data: {
        type: 'node',
        id: 'root',
        label: 'root',
        data: dist.getPropertyTable,
      } satisfies PropertyTableEntryNode,
      linkedData: {
        'RDF/XML': dist.getLinkedData.rdf,
        'Turtle': dist.getLinkedData.ttl,
        'Notation3': dist.getLinkedData.n3,
        'N-Tripes': dist.getLinkedData.nt,
        'JSON-LD': dist.getLinkedData.jsonld,
      },
    }
  })
})

// const { getTitle, getId, getDescription, getPropertyTable, getFormattedDistributions, getCategories } = toRefs(resultEnhanced)
const { isError: searchError, error } = query
// Parse AxiosError to get the error message
const errorView = computed(() => {
  if (searchError.value) {
    return error.value?.message || 'An error occurred'
  }
  return ''
})

// Distribution truncator ("show more")
const {
  data: truncatedFormattedDistributions,
  toggle: showAllDistributions,
  isTruncated: isDistributionsTruncated,
} = useDataTruncator({
  data: getFormattedDistributions,
  limit: 7,
})

const { t } = useI18n()
</script>

<template>
  <div>
    <div v-if="error" class="bg-bg-base grid size-full place-content-center">
      <KCard class="size-96">
        <span class="p-card-title mb-2 text-2xl font-medium">{{ t('dataset.error') }}</span>
        <div> {{ errorView }}</div>
      </KCard>
    </div>
    <DetailsPage
      :headline="t('dataset.title')"
      :title="resultEnhanced?.getTitle || ''"
      :subtitle="resultEnhanced?.getPublisher?.name || ''"
      :dataset-id="datasetId"
      :summary="[
        {
          title: t('dataset.provider'),
          text: resultEnhanced?.getPublisher?.name || '-',
        },
        {
          title: t('dataset.updated'),
          text: resultEnhanced?.getModified || '-',
        },
      ]" :description-markup="resultEnhanced?.getDescriptionMarkup"
    >
      <template #subtitle="{ subtitle }">
        <RouterLink
          :to="{ name: 'Datasets', query: { catalog: resultEnhanced?.getCatalogId } }" class="
            by-link
          "
        >
          {{ subtitle }}
        </RouterLink>
      </template>

      <template #sections>
        <section class="space-y-4">
          <div class="mt-12 flex flex-row items-center gap-2">
            <h2 class="text-[2.5rem] leading-[3rem] font-bold text-surface-text">
              {{ t('dataset.distributions') }}
            </h2>
            <KTag class="rounded-full bg-secondary">
              {{
                getFormattedDistributions?.length
              }}
            </KTag>
          </div>
          <div class="bg-bg-divider h-px w-full" />
          <div name="distribution-cards" class="relative">
            <template v-for="(distribution, i) in truncatedFormattedDistributions" :key="distribution.id">
              <div name="distribution-card-wrapper" class="relative">
                <DistributionCard
                  :title="distribution.title || ''" :description="distribution.descriptionMarkup || ''"
                  :format="distribution.format || 'Unknown'" :download-url="distribution.downloadUrls?.[0]!"
                  :last-updated="distribution.modified" :data="distribution.data"
                  :linked-data="distribution.linkedData" :distribution-id="distribution.id"
                />
                <div
                  v-if="i === truncatedFormattedDistributions.length - 1 && isDistributionsTruncated"
                  name="distribution-card-overlay"
                  class="
                    absolute top-0 left-0 size-full bg-linear-to-b
                    from-transparent from-0% to-white to-55%
                  "
                >
                  <div
                    class="
                      absolute bottom-0 flex w-full flex-row items-center
                      justify-center
                    "
                  >
                    <div>
                      <KButton
                        :label="`${t('dataset.show_more')} (${getFormattedDistributions.length})`"
                        @click="showAllDistributions"
                      >
                        <i class="icon-[ph--eye-fill]" />
                      </KButton>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
        </section>
        <div
          v-if="(resultEnhanced?.getCategories?.length || 0) > 0" class="
            space-y-3
          "
        >
          <Typography
            variant="by-heading-4" class="text-primary-100 font-semibold"
          >
            {{ t('dataset.categories') }}
          </Typography>
          <div class="flex flex-row gap-2">
            <KTag
              v-for="category in resultEnhanced?.getCategories" :key="category.id" interactive
              @click="router.push({ name: 'Datasets', query: { categories: category.id } })"
            >
              {{ getLocalizedValue({ obj: category.label, fallbackLocale: 'de' }) }}
            </KTag>
          </div>
        </div>
        <div class="bg-bg-divider h-px w-full" />
        <div class="space-y-4">
          <div class="flex flex-col gap-4 rounded-xl bg-surface p-4">
            <Typography variant="by-heading-4" class="">
              {{ t('dataset.additional_info') }}
            </Typography>
            <PropertyTable
              v-if="isSuccess" :node="{
                type: 'node',
                id: 'a',
                label: 'a',
                data: resultEnhanced?.getPropertyTable2 || undefined,
              }"
            />
          </div>
        </div>
      </template>
    </DetailsPage>
  </div>
</template>
