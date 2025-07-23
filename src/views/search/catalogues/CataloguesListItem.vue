<script setup lang="ts">
import { RouterLink } from 'vue-router'

const props = defineProps<{
  item: {
    id: string
    title: string
    description: string
  }
}>()
</script>

<template>
  <RouterLink :to="{ path: '/datasets', query: { catalog: item.getId } }">
    <div
      class="
        group relative mx-auto mb-6 box-border w-full rounded-3xl border-b-[3px]
        border-neutral-20 border-b-transparent bg-surface p-12
        hover:border-b-primary
      "
    >
      <div class="flex flex-col gap-by5 text-surface-text">
        <span
          class="
            mb-6 font-sans text-[1.375rem] leading-[2rem] font-bold
            md:text-[1.5rem] md:leading-[2.25rem]
          "
        >
          {{ item.getTitle ?? '' }}
        </span>
        <div class="flex flex-col gap-16">
          <div class="grid grid-cols-12 gap-4">
            <p
              class="
                col-span-12 line-clamp-6
                lg:col-span-8
              "
            >
              {{ item.getDescription ?? '' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </RouterLink>
</template>
