<script setup>
import DropdownList from '@/components/base/dropdown-list/DropdownList.vue'

import KTag from '@/components/base/tag/KTag.vue'
import { onMounted, ref } from 'vue'
import {
  getDatasetMetrics,
  getDistributionsMetrics,
} from './DataQualityService'

const props = defineProps({
  id: String,
})

const datasetId = props.id

const datasetMetrics = ref({})
const relevantDatasetMetrics = ref([])
const relevantDistributionsMetrics = ref([])
const accordionItems = ref([])
const isDatasetMetricsAvailable = ref(false)
const isDistributionsMetricsAvailable = ref(false)

/* helpers function */
function fmt(v) {
  if (Array.isArray(v)) {
    if (v.length === 0)
      return 'N/A'
    const yes = v.find(x => x.name === 'yes')
    return yes?.percentage != null ? `${yes.percentage} %` : JSON.stringify(v)
  }
  if (typeof v === 'boolean')
    return v ? 'yes' : 'no'
  if (v && typeof v === 'object' && !Object.keys(v).length)
    return 'N/A'
  return v ?? 'N/A'
}

/* dataset metrics */
async function loadDatasetMetrics() {
  try {
    const raw = (await getDatasetMetrics(datasetId)).result.results[0]
    datasetMetrics.value = raw

    const sec = (title, arr) => ({ title, items: arr })

    relevantDatasetMetrics.value = [
      sec('Accessibility', [
        {
          'Download URL': fmt(raw.accessibility?.[0]?.downloadUrlAvailability),
        },
        {
          'Most frequent accessing status codes': fmt(
            raw.accessibility?.[1]?.accessUrlStatusCode[0].name,
          ),
        },
        {
          'Most frequent distribution status codes': fmt(
            raw.accessibility?.[2]?.downloadUrlStatusCode?.[0]?.name,
          ),
        },
      ]),
      sec('Findability', [
        { 'Keyword usage': fmt(raw.findability?.[0]?.keywordAvailability) },
        { Categories: fmt(raw.findability?.[1]?.categoryAvailability) },
        { 'Geo search': fmt(raw.findability?.[2]?.spatialAvailability) },
        {
          'Time based search': fmt(raw.findability?.[3]?.temporalAvailability),
        },
      ]),
      sec('Reusability', [
        {
          'Access restrictions': fmt(
            raw.reusability?.[0]?.accessRightsAvailability,
          ),
        },
        {
          'License information': fmt(raw.reusability?.[1]?.licenceAvailability),
        },
        {
          'Access restrictions vocabulary': fmt(
            raw.reusability?.[2]?.accessRightsVocabularyAlignment,
          ),
        },
        {
          'Contact point': fmt(raw.reusability?.[3]?.contactPointAvailability),
        },
        { Publisher: fmt(raw.reusability?.[4]?.publisherAvailability) },
      ]),
      sec('Interoperability', [
        {
          'DCAT-AP compliance': fmt(
            raw.interoperability?.[0]?.dcatApCompliance,
          ),
        },
        { Format: fmt(raw.interoperability?.[1]?.formatAvailability) },
        { 'Media type': fmt(raw.interoperability?.[2]?.mediaTypeAvailability) },
        {
          'Format / Media type from Vocabulary': fmt(
            raw.interoperability?.[3]?.formatMediaTypeVocabularyAlignment,
          ),
        },
      ]),
      sec('Contextuality', [
        { 'File size': fmt(raw.contextuality?.[0]?.byteSizeAvailability) },
        {
          'Rights Vocabulary': fmt(raw.contextuality?.[1]?.rightsAvailability),
        },
        {
          'Spatial data of issue': fmt(
            raw.findability?.[2]?.spatialAvailability,
          ),
        },
        {
          'Distribution Modification date': fmt(
            raw.contextuality?.[3]?.distributions?.[0]?.dateModifiedAvailability,
          ),
        },
        {
          'Temporal data of issue': fmt(
            raw.contextuality?.[3]?.distributions?.[1]?.dateIssuedAvailability,
          ),
        },
      ]),
    ]
    isDatasetMetricsAvailable.value = true
  }
  catch (e) {
    console.error('Loading dataset metrics failed:', e)
  }
}

/* distribution metrics */
async function loadDistributionsMetrics() {
  try {
    const distributions = (
      await getDistributionsMetrics(datasetId)
    ).result.results.flat()
    relevantDistributionsMetrics.value = distributions

    accordionItems.value = distributions.map(d => ({
      label:
        d.info?.['distribution-title']
        || d.info?.['distribution-id']
        || 'Unknown distribution',
      icon: 'i-lucide-box',
      sections: [
        {
          title: 'Accessibility',
          items: [
            {
              title: 'Download URL',
              value: fmt(d.accessibility?.[0]?.downloadUrlAvailability),
            },
            {
              title: 'Most frequent accessURL status code',
              value: fmt(d.accessibility?.[1]?.accessUrlStatusCode),
            },
            {
              title: 'Most frequent downloadURL status code',
              value: fmt(d.accessibility?.[2]?.downloadUrlStatusCode),
            },
          ],
        },
        {
          title: 'Reusability',
          items: [
            {
              title: 'License information',
              value: fmt(d.reusability?.[0]?.licenceAvailability),
            },
          ],
        },
        {
          title: 'Contextuality',
          items: [
            {
              title: 'File size',
              value: fmt(d.contextuality?.[0]?.byteSizeAvailability),
            },
            {
              title: 'Rights',
              value: fmt(d.contextuality?.[1]?.rightsAvailability),
            },
            {
              title: 'Modification date',
              value: fmt(d.contextuality?.[2]?.dateModifiedAvailability),
            },
            {
              title: 'Date of issue',
              value: fmt(d.contextuality?.[3]?.dateIssuedAvailability),
            },
          ],
        },
        {
          title: 'Interoperability',
          items: [
            {
              title: 'Format',
              value: fmt(d.interoperability?.[0]?.formatAvailability),
            },
            {
              title: 'Media type',
              value: fmt(d.interoperability?.[1]?.mediaTypeAvailability),
            },
            {
              title: 'Format/Media type from vocabulary',
              value: fmt(
                d.interoperability?.[2]?.formatMediaTypeVocabularyAlignment,
              ),
            },
          ],
        },
      ],
    }))
    isDistributionsMetricsAvailable.value = true
  }
  catch (e) {
    console.error('Loading distribution metrics failed:', e)
  }
}

onMounted(() => {
  loadDatasetMetrics()
  loadDistributionsMetrics()
})
</script>

<template>
  <div class="text-gray-800">
    <!-- Main Content -->
    <main class="container mx-auto p-1">
      <section class="mb-10">
        <h3 class="mb-2 text-2xl font-semibold text-gray-700">
          {{ $t('data-quality.title') }}
        </h3>
        <p class="mb-6 text-gray-600">
          {{ $t('data-quality.description') }}
        </p>

        <!-- Cards -->
        <div
          v-if="isDatasetMetricsAvailable" class="
            grid grid-cols-1 gap-6
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          <div
            v-for="card in relevantDatasetMetrics"
            :key="card.title"
            class="rounded-xl bg-surface p-5"
          >
            <h4 class="text-pistis-700 mb-4 text-xl font-semibold">
              {{ card.title }}
            </h4>
            <ul class="space-y-3 text-sm">
              <li
                v-for="line in card.items"
                :key="line.title"
                class="flex items-center justify-between"
              >
                <span class="wrap-anywhere">{{ Object.keys(line)[0] }}</span>
                <KTag>{{ line[Object.keys(line)[0]] }}</KTag>
              </li>
            </ul>
          </div>
        </div>
        <div v-else>
          <p class="italic">
            {{ $t('data-quality.no-data-available') }}
          </p>
        </div>
      </section>

      <!-- Distribution Quality Section -->
      <section class="mb-10">
        <h3 class="mb-2 text-2xl font-semibold text-gray-700">
          {{ $t('data-quality.distribution') }}
        </h3>

        <p class="mb-6 text-gray-600">
          {{ $t('data-quality.distribution-description') }}
        </p>

        <div v-if="isDistributionsMetricsAvailable" class="space-y-4">
          <DropdownList :items="accordionItems" />
        </div>
        <div v-else>
          <p class="italic">
            {{ $t('data-quality.no-data-available') }}
          </p>
        </div>
      </section>
    </main>
  </div>
</template>
