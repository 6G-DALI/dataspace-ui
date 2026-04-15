<script setup lang="ts">
import { cva } from 'class-variance-authority'
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
  },
  size: {
    type: String,
    default: 'large',
  },
  icon: {
    type: Boolean,
    default: false,
  },
})

const button = cva(`
  inline-flex min-w-fit items-center justify-center rounded-3xl
  border-transparent text-center align-bottom font-medium
`, {
  variants: {
    variant: {
      primary: `
        dark:bg-primary-dark dark:text-surface-900
        dark:hover:bg-primary-dark-hover dark:active:bg-primary-dark-pressed
        bg-primary text-white dark:text-white
        hover:bg-primary-hover
        active:bg-primary
      `,
      secondary: `
        dark:text-secondary-dark-text dark:bg-secondary-dark
        dark:hover:bg-secondary-dark-hover dark:active:bg-secondary-dark-pressed
        bg-secondary text-secondary-text
        hover:bg-secondary-hover
        active:bg-secondary-pressed
      `,
    },
    size: {
      small: 'h-8 px-4 py-2 text-sm',
      large: 'h-12 px-4 py-3 text-lg',
    },
  },
})

const buttonClass = computed(() =>
  button({ variant: props.variant, size: props.size }),
)
</script>

<template>
  <button :class="buttonClass">
    <slot />
  </button>
</template>
