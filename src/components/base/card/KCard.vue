<script setup lang="ts">
import { computed, useAttrs } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const resolvedAttrs = computed(() => ({ ...useAttrs()}))

</script>

<template>
  <div
    v-bind="resolvedAttrs"
    class="p-card p-component size-96 rounded-lg leading-7 border border-bg-divider bg-surface-0 dark:bg-surface-900 text-content dark:text-surface-0"
  >
    <div
      class="p-card-body p-6 text-center"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped></style>