<template>
    <div>
        <div v-for="item in items" :key="item.title" class="rounded-xl bg-surface mb-4">
            <button class="w-full text-left p-3 font-semibold flex items-center justify-between" @click="toggle(item)">
                {{ item.label }}
                <i class="icon-[ph--caret-down] mr-3" /> 
            </button>

            <div v-if="openItems.includes(item)" class="p-4 text-sm">
                <div v-for="section in item.sections" :key="section.title" class="mb-4">
                    <h5 class="text-md font-semibold mb-2">
                        {{ section.title }}
                    </h5>
                    <ul class="space-y-2 pl-2">
                        <li v-for="line in section.items" :key="line.title" class="flex justify-between">
                            <span>{{ line.title }}</span>
                            <span class="font-bold">{{ line.value }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
    items: { type: Array, required: true },
});

const openItems = ref([]);

function toggle(item) {
    if (openItems.value.includes(item)) {
        openItems.value = openItems.value.filter((i) => i !== item);
    } else {
        openItems.value.push(item);
    }
}
</script>
