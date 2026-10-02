<script lang="ts" setup>
import type { PropertyTableEntryNode } from '@piveau/sdk-vue'
import { useDataTruncator } from '@/composables/useDataTruncator'
import { getLocalizedValue } from '@/sdk/utils/helpers'
import DOMPurify from 'isomorphic-dompurify'
import { marked } from 'marked'
import { computed, inject, ref, toValue } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import ServiceInfoBanner from '../gx-quality/ServiceInfoBanner.vue'
import appConfig from '../../../config/appConfig'
import KTag from '../base/tag/KTag.vue'
import Typography from '../base/typography/Typography.vue'
import DistributionCard from '../distribution-card/DistributionCard.vue'
import { PropertyTable } from '../property-table/PropertyTableRow'

const { t } = useI18n()
const router = useRouter()

const { resultEnhanced, isSuccess, distributionConnectorTypes, distributionAssetIds, variableMeasured } = inject('datasetDetails') as any
const servicesCatalogue = appConfig.servicesCatalogue || '6g-dali-services'
const modelsCatalogue = appConfig.modelsCatalogue || '6g-dali-models'
const isService = computed(() => resultEnhanced?.value?.getCatalogId === servicesCatalogue)
const isModel = computed(() => resultEnhanced?.value?.getCatalogId === modelsCatalogue)

const { data: truncatedDescription, toggle: toggleDescription, isTruncated: isDescriptionTruncated, isTruncationNeeded: isDescriptionTruncationNeeded } = useDataTruncator({
  data: computed(() => resultEnhanced?.value?.getDescriptionMarkup || ''),
  limit: 550,
})

const truncatedEllipsedDescription = computed(() => {
  if (toValue(isDescriptionTruncated)) {
    return `${truncatedDescription.value}...`
  }
  return truncatedDescription.value
})

// The SDK's getDistributions() mapper doesn't project a `mediaType` field —
// dcat:mediaType only shows up as a leaf inside getPropertyTable (id
// "mediaType", built from the raw media_type field), so it has to be dug out
// from there instead of read directly off the distribution object.
function extractPropertyValue(table: PropertyTableEntryNode[] | undefined, id: string): string {
  const node = table?.find(n => n.id === id) as { data?: { data?: unknown }[] } | undefined
  const value = node?.data?.[0]?.data
  return typeof value === 'string' ? value : ''
}

const getFormattedDistributions = computed(() => {
  if (!isSuccess?.value)
    return []
  if (!resultEnhanced?.value?.getDistributions)
    return []

  return resultEnhanced.value.getDistributions.map((dist) => {
    return {
      title: dist.title ?? dist.id ?? '',
      description: dist.description ?? '',
      descriptionMarkup: DOMPurify.sanitize(marked(dist.description ?? '', { async: false })),
      // accessURL is not a download link (e.g. it may point at a connector
      // endpoint requiring negotiation) — only a genuine downloadURL is used here.
      downloadUrls: dist.downloadUrls || [],
      format: dist.format ?? '',
      mediaType: extractPropertyValue(dist.getPropertyTable, 'mediaType'),
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

// Master/detail distribution selection
const selectedDistributionIndex = ref(0)
const selectedDistribution = computed(() => getFormattedDistributions.value[selectedDistributionIndex.value] || null)
const isLinkedDataDropdownOpen = ref(false)

function selectDistribution(i: number) {
  selectedDistributionIndex.value = i
  isLinkedDataDropdownOpen.value = false
}

function toggleDropdown() {
  isLinkedDataDropdownOpen.value = !isLinkedDataDropdownOpen.value
}

const hasCategories = computed(() => (resultEnhanced?.value?.getCategories?.length || 0) > 0)
const hasKeywords = computed(() => (resultEnhanced?.value?.getKeywords?.length || 0) > 0)

const providerName = computed(() => resultEnhanced?.value?.getPublisher?.name || '')
const updatedText = computed(() => resultEnhanced?.value?.getModified || '')
</script>

<template>
  <div>
    <ServiceInfoBanner />
    <slot name="sections">
      <div
        class="relative left-1/2 right-1/2 -mx-[50vw] mb-10 w-screen border-y border-bg-divider bg-surface"
      >
        <div class="container mx-auto flex flex-col gap-8 px-4 py-6 lg:flex-row lg:items-start">
          <!-- Column 1: About + Provider + Updated -->
          <div class="min-w-0 flex-1">
            <Typography as="h5" variant="header-4" class="mb-2 text-surface-text">
              <slot name="about-this-dataset">
                {{ isService ? 'About this service' : isModel ? 'About this model' : t('details.about_dataset') }}
              </slot>
            </Typography>
            <Typography
              as="div" variant="by-copy-small-regular" class="markdown-content"
              v-html="truncatedEllipsedDescription"
            />
            <button
              v-if="isDescriptionTruncationNeeded"
              class="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
              @click="toggleDescription"
            >
              <span>{{ t('details.read_more') }}</span>
              <i v-if="isDescriptionTruncated" class="icon-[ph--caret-down]" />
              <i v-else class="icon-[ph--caret-up]" />
            </button>

            <div v-if="providerName || updatedText" class="mt-5 flex flex-wrap gap-8 border-t border-bg-divider pt-4 text-xs">
              <div v-if="providerName">
                <div class="text-[11px] font-medium tracking-wider text-surface-light uppercase">
                  {{ t('dataset.provider') }}
                </div>
                <div class="mt-1 text-surface-text">{{ providerName }}</div>
              </div>
              <div v-if="updatedText">
                <div class="text-[11px] font-medium tracking-wider text-surface-light uppercase">
                  {{ t('dataset.updated') }}
                </div>
                <div class="mt-1 text-surface-text">{{ updatedText }}</div>
              </div>
            </div>
          </div>

          <!-- Column 2: Additional information -->
          <div
            v-if="isSuccess"
            class="min-w-0 flex-1 border-t border-bg-divider pt-4 text-xs text-surface-light lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          >
            <PropertyTable :node="{ type: 'node', id: 'a', label: 'a', data: resultEnhanced?.getPropertyTable2 || undefined }" class="text-sm" />
          </div>

          <!-- Column 3: Categories + Keywords -->
          <div
            v-if="hasCategories || hasKeywords"
            class="flex min-w-0 flex-col gap-4 border-t border-bg-divider pt-4 text-xs text-surface-light lg:w-56 lg:shrink-0 lg:grow-0 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-8"
          >
            <div v-if="hasCategories" class="flex flex-wrap items-center gap-2">
              <span class="font-medium whitespace-nowrap text-surface-text">{{ t('dataset.categories') }}:</span>
              <KTag
                v-for="category in resultEnhanced?.getCategories" :key="category.id" interactive class="text-xs"
                @click="router.push({ name: 'Datasets', query: { categories: category.id } })"
              >
                {{ getLocalizedValue({ obj: category.label, fallbackLocale: 'de' }) }}
              </KTag>
            </div>
            <div v-if="hasKeywords" class="flex flex-wrap items-center gap-2">
              <span class="font-medium whitespace-nowrap text-surface-text">{{ t('dataset.keywords') }}:</span>
              <KTag v-for="keyword in resultEnhanced?.getKeywords" :key="keyword.id" class="text-xs">
                {{ keyword.label }}
              </KTag>
            </div>
          </div>
        </div>
      </div>
      <section class="mb-10">
        <div class="flex flex-row items-center gap-2">
          <Typography
            variant="by-heading-4" class="text-primary-100 font-semibold"
          >
            {{ t('dataset.distributions') }}
          </Typography>
          <KTag class="rounded-full bg-secondary">
            {{
              getFormattedDistributions?.length
            }}
          </KTag>
        </div>
        <div class="bg-bg-divider h-px w-full" />
        <div class="mt-4 flex flex-col gap-6 lg:flex-row lg:items-start">
          <!-- Distribution list -->
          <nav class="lg:w-72 lg:shrink-0" aria-label="Distributions">
            <ul class="flex flex-col overflow-hidden rounded-xl border border-bg-divider">
              <li v-for="(distribution, i) in getFormattedDistributions" :key="distribution.id">
                <button
                  type="button"
                  class="flex w-full flex-col items-start gap-0.5 px-4 py-3 text-left transition-colors"
                  :class="[
                    i === selectedDistributionIndex ? 'bg-primary/10' : 'hover:bg-bg-divider/40',
                    i > 0 ? 'border-t border-bg-divider' : '',
                  ]"
                  @click="selectDistribution(i)"
                >
                  <span
                    class="w-full truncate text-sm font-medium"
                    :class="i === selectedDistributionIndex ? 'text-primary' : 'text-surface-text'"
                  >
                    {{ distribution.title || `${t('dataset.distributions')} ${i + 1}` }}
                  </span>
                  <span class="text-xs text-surface-light">{{ distribution.mediaType || 'Unknown' }}</span>
                </button>
              </li>
            </ul>
          </nav>

          <!-- Selected distribution -->
          <div class="min-w-0 flex-1">
            <DistributionCard
              v-if="selectedDistribution"
              :key="selectedDistribution.id"
              :title="selectedDistribution.title || ''" :description="selectedDistribution.descriptionMarkup || ''"
              :format="selectedDistribution.format || 'Unknown'" :download-url="selectedDistribution.downloadUrls?.[0]!"
              :access-url="selectedDistribution.accessUrls?.[0]"
              :asset-id="distributionAssetIds?.[selectedDistribution.id]"
              :connector-type="distributionConnectorTypes?.[selectedDistribution.id]"
              :variable-measured="variableMeasured"
              :mediaType="selectedDistribution.mediaType"
              :last-updated="selectedDistribution.modified" :data="selectedDistribution.data" :linked-data="selectedDistribution.linkedData"
              :distribution-id="selectedDistribution.id" :showDropdown="isLinkedDataDropdownOpen"
              @toggle="toggleDropdown" download-text="Download" save-text="Linked Data"
            />
          </div>
        </div>
      </section>
    </slot>
  </div>
</template>
