<script setup lang="ts">
import clsx from 'clsx'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    as?: string
    text?: string
    icon?: string
    iconRight?: string
    iconLeft?: string
    variant?:
      | 'header-1'
      | 'header-2'
      | 'header-3'
      | 'header-4'
      | 'paragraph-1'
      | 'paragraph-2'
      | 'caption'
      | 'numeric'
      | 'button-text'
      | 'code-or-data-tables'
      // by typography types have by-* prefix
      | 'by-heading-1'
      | 'by-heading-2'
      | 'by-heading-3'
      | 'by-heading-4'
      | 'by-heading-5'
      | 'by-caption'
      | 'by-copy-large-regular'
      | 'by-copy-large-semibold'
      | 'by-copy-large-bold'
      | 'by-copy-small-regular'
      | 'by-copy-small-semibold'
      | 'by-copy-small-bold'
      | 'by-copy-mini-regular'
      | 'by-copy-mini-semibold'
      | 'by-copy-mini-bold'
  }>(),
  {
    as: 'span',
    variant: 'paragraph-2',
  },
)

const computedClasses = computed(() =>
  clsx(
    // heading
    {
      'text-5xl font-bold text-surface-text': props.variant === 'header-1',
      'text-4xl font-semibold text-surface-text': props.variant === 'header-2',
      'text-3xl font-semibold text-surface-text': props.variant === 'header-3',
      'text-lg font-semibold text-surface-text': props.variant === 'header-4',

      // by-heading
      'md:leading[4.75rem] font-display text-[3.5rem] leading-[3.5rem] font-bold text-surface-text md:text-[4.5rem]': props.variant === 'by-heading-1',
      'font-display text-[2rem] leading-[2.5rem] font-bold text-surface-text md:text-[3rem] md:leading-[3.5rem]': props.variant === 'by-heading-2',
      'md:font-size[2.5rem] font-sans text-[1.75rem] leading-[2.375rem] font-bold text-surface-text md:leading-[3rem]': props.variant === 'by-heading-3',
      'font-sans text-[1.375rem] leading-[2rem] font-bold text-surface-text md:text-[1.5rem] md:leading-[2.25rem]': props.variant === 'by-heading-4',
      'font-sans text-[1.125rem] leading-[1.75rem] font-semibold text-surface-text': props.variant === 'by-heading-5',
    },
    // paragraph
    {
      'text-base font-semibold': props.variant === 'paragraph-1',
      'text-base font-normal': props.variant === 'paragraph-2',
    },
    // by-caption
    {
      // .75rem/1.125rem
      'text-xs leading-[1.125rem] font-bold text-surface-text uppercase': props.variant === 'caption' || props.variant === 'by-caption',
    },
    // by-copy
    [
      // large
      {
        'text-lg font-normal text-surface-light': props.variant === 'by-copy-large-regular',
        'text-lg font-semibold text-surface-light': props.variant === 'by-copy-large-semibold',
        'text-lg font-bold text-surface-light': props.variant === 'by-copy-large-bold',
      },
      // small
      {
        'text-sm font-normal text-surface-light': props.variant === 'by-copy-small-regular',
        'text-sm font-semibold text-surface-light': props.variant === 'by-copy-small-semibold',
        'text-sm font-bold text-surface-light': props.variant === 'by-copy-small-bold',
      },
      // mini
      {
        'text-xs font-normal text-surface-light': props.variant === 'by-copy-mini-regular',
        'text-xs font-semibold text-surface-light': props.variant === 'by-copy-mini-semibold',
        'text-xs font-bold text-surface-light': props.variant === 'by-copy-mini-bold',
      },
    ],
    // numeric
    // todo: apply roboto condensed
    {
      'text-sm font-normal': props.variant === 'numeric',
    },
    // button-text
    {
      'text-base font-medium uppercase': props.variant === 'button-text',
    },
    // code-or-data-tables
    // todo: apply roboto mono
    {
      'text-sm font-normal': props.variant === 'code-or-data-tables',
    },
  ),
)

const hasIcon = computed(() => props.icon || props.iconRight || props.iconLeft)
</script>

<template>
  <component
    :is="props.as"
    :class="computedClasses"
  >
    <template v-if="hasIcon">
      <span
        class="inline-flex min-w-fit flex-row flex-nowrap items-center gap-2" :class="{
          'flex-row-reverse': props.iconRight,
        }"
      >
        <slot name="icon" :icon="hasIcon"> <i :class="hasIcon" /></slot>
        <slot>{{ text }}</slot>
      </span>
    </template>
    <template v-else>
      <slot>{{ text }}</slot>
    </template>
  </component>
</template>
