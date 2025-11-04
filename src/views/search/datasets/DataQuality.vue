<template>
    <div class="text-gray-800">
        <!-- Main Content -->
        <main class="container mx-auto p-1">
            
            <section class="mb-10">
                <h3 class="text-2xl font-semibold text-gray-700 mb-2">Metadata quality</h3>
                <p class="text-gray-600 mb-6">
                    The Metadata Quality Assurance is intended to help data providers and data portals to check their
                    metadata against various indicators.
                </p>

                <!-- Cards -->
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div
                        v-for="card in relevantDatasetMetrics"
                        :key="card.title"
                        :class="` bg-surface p-5 rounded-xl`"
                    >
                        <!-- :class="`${card.bg} ${card.text} p-6 rounded-lg shadow-lg`" -->
                        <h4 class="text-xl font-semibold text-pistis-700 mb-4">{{ card.title }}</h4>
                        <ul class="space-y-3 text-sm">
                            <li v-for="line in card.items" :key="line.title" class="flex justify-between items-center">
                                <span class="wrap-anywhere">{{ Object.keys(line)[0] }}</span>
                                <KTag>{{ line[Object.keys(line)[0]] }}</KTag>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>





  <section class="mb-10">
    <h3 class="text-2xl font-semibold text-gray-700 mb-2">
      Distribution Meta Data Quality
    </h3>

    <p class="text-gray-600 mb-6">
      The following lists the quality measurement of all distributions of the dataset.
      <!-- <RouterLink to="/methodology" class="text-purple-600 hover:underline">methodology page</RouterLink> -->
    </p>

    <div class="space-y-4">
      <!-- Custom Accordion -->
      <Accordion :items="accordionItems" />
    </div>
  </section>





            <!-- Distribution Quality Section -->
            <section v-if="false" class="mb-10">
                <h3 class="text-2xl font-semibold text-gray-700 mb-2">Distribution Meta Data Quality</h3>
                <p class="text-gray-600 mb-6">
                    The following lists the quality measurement of all distributions of the dataset.
                </p>

                <div class="space-y-4">
                    <div>
                            <div class="p-4 text-gray-700">
                                <div class="accordion-content p-3 text-sm text-gray-600">
                                    <div class="space-y-5">
                                        <div v-for="section in item.sections" :key="section.title">
                                            <h5 class="text-md font-semibold text-gray-700 mb-2">
                                                {{ section.title }}
                                            </h5>
                                            <ul class="space-y-2 pl-2">
                                                <li
                                                    v-for="line in section.items"
                                                    :key="line.title"
                                                    class="flex justify-between items-center"
                                                >
                                                    <span>{{ line.title }}</span>
                                                    <span class="distribution-metadata-value font-bold">
                                                        {{ line.value }}
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { getDatasetMetrics, getDistributionsMetrics } from './DataQualityService';
import PhCaretLeft from '~icons/ph/caret-left';
import KTag from '@/components/base/tag/KTag.vue';
import Accordion from './Accordion.vue'


const datasetId = '5448d3e0c751df01f85d0572';

const datasetMetrics = ref({});
const relevantDatasetMetrics = ref([]);
const relevantDistributionsMetrics = ref([]);
const accordionItems = ref([]);

/* helpers function */
const fmt = (v) => {
    if (Array.isArray(v)) {
        if (v.length === 0) return 'N/A';
        const yes = v.find((x) => x.name === 'yes');
        return yes?.percentage != null ? `${yes.percentage} %` : JSON.stringify(v);
    }
    if (typeof v === 'boolean') return v ? 'yes' : 'no';
    if (v && typeof v === 'object' && !Object.keys(v).length) return 'N/A';
    return v ?? 'N/A';
};

/* dataset metrics */
async function loadDatasetMetrics() {
    try {
        const raw = (await getDatasetMetrics(datasetId)).result.results[0];
        datasetMetrics.value = raw;

        const sec = (title, arr) => ({ title, items: arr });

        relevantDatasetMetrics.value = [
            sec('Accessibility', [
                { 'Download URL': fmt(raw.accessibility?.[0]?.downloadUrlAvailability) },
                { 'Most frequent accessing status codes': fmt(raw.accessibility?.[1]?.accessUrlStatusCode) },
                { 'Most frequent distribution status codes': fmt(raw.accessibility?.[2]?.downloadUrlStatusCode) },
            ]),
            sec('Findability', [
                { 'Keyword usage': fmt(raw.findability?.[0]?.keywordAvailability) },
                { Categories: fmt(raw.findability?.[1]?.categoryAvailability) },
                { 'Geo search': fmt(raw.findability?.[2]?.spatialAvailability) },
                { 'Time based search': fmt(raw.findability?.[3]?.temporalAvailability) },
            ]),
            sec('Reusability', [
                { 'Access restrictions': fmt(raw.reusability?.[0]?.accessRightsAvailability) },
                { 'License information': fmt(raw.reusability?.[1]?.licenceAvailability) },
                { 'Access restrictions vocabulary': fmt(raw.reusability?.[2]?.accessRightsVocabularyAlignment) },
                { 'Contact point': fmt(raw.reusability?.[3]?.contactPointAvailability) },
                { Publisher: fmt(raw.reusability?.[4]?.publisherAvailability) },
            ]),
            sec('Interoperability', [
                { 'DCAT-AP compliance': fmt(raw.interoperability?.[0]?.dcatApCompliance) },
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
                { 'Rights Vocabulary': fmt(raw.contextuality?.[1]?.rightsAvailability) },
                { 'Spatial data of issue': fmt(raw.findability?.[2]?.spatialAvailability) },
                {
                    'Distribution Modification date': fmt(
                        raw.contextuality?.[3]?.distributions?.[0]?.dateModifiedAvailability,
                    ),
                },
                { 'Temporal data of issue': fmt(raw.contextuality?.[3]?.distributions?.[1]?.dateIssuedAvailability) },
            ]),
        ];
    } catch (e) {
        console.error('Loading dataset metrics failed:', e);
    }
}

/* distribution metrics */
async function loadDistributionsMetrics() {
    try {
        const distributions = (await getDistributionsMetrics(datasetId)).result.results.flat();
        relevantDistributionsMetrics.value = distributions;

        accordionItems.value = distributions.map((d) => ({
            label: d.info?.['distribution-title'] || d.info?.['distribution-id'] || 'Unknown distribution',
            icon: 'i-lucide-box',
            sections: [
                {
                    title: 'Accessibility',
                    items: [
                        { title: 'Download URL', value: fmt(d.accessibility?.[0]?.downloadUrlAvailability) },
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
                    items: [{ title: 'License information', value: fmt(d.reusability?.[0]?.licenceAvailability) }],
                },
                {
                    title: 'Contextuality',
                    items: [
                        { title: 'File size', value: fmt(d.contextuality?.[0]?.byteSizeAvailability) },
                        { title: 'Rights', value: fmt(d.contextuality?.[1]?.rightsAvailability) },
                        { title: 'Modification date', value: fmt(d.contextuality?.[2]?.dateModifiedAvailability) },
                        { title: 'Date of issue', value: fmt(d.contextuality?.[3]?.dateIssuedAvailability) },
                    ],
                },
                {
                    title: 'Interoperability',
                    items: [
                        { title: 'Format', value: fmt(d.interoperability?.[0]?.formatAvailability) },
                        { title: 'Media type', value: fmt(d.interoperability?.[1]?.mediaTypeAvailability) },
                        {
                            title: 'Format/Media type from vocabulary',
                            value: fmt(d.interoperability?.[2]?.formatMediaTypeVocabularyAlignment),
                        },
                    ],
                },
            ],
        }));
    } catch (e) {
        console.error('Loading distribution metrics failed:', e);
    }
}

onMounted(() => {
    loadDatasetMetrics();
    loadDistributionsMetrics();
});
</script>

<style scoped>
/* Metadata highlights */
/* .wrap-anywhere {
    overflow-wrap: anywhere;
}

.metadata-value {
    background-color: #c5c8ff;
    padding: 0.125rem 0.5rem;
    border-radius: 0.25rem;
    border: 1px solid #a2a4ff;
    min-width: 60px;
    text-align: center;
}
.metadata-value-yellow {
    background-color: rgba(0, 0, 0, 0.05);
    border: 1px solid rgba(0, 0, 0, 0.1);
    color: #374151;
}
.distribution-metadata-value {
    background-color: #c5c8ff;
    /* color: #5b21b6; */
    /* padding: 0.125rem 0.5rem; 
    border-radius: 0.25rem;
    border: 1px solid #a2a4ff;
    min-width: 50px;
    text-align: center;
    font-weight: 500;
} */
</style>
