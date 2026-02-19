<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const fontFamily = ref('Inter')
const borderRadius = ref('25')
const fonts = ['Arial', 'Courier New', 'Georgia', 'Century Gothic', 'Times New Roman', 'Verdana', 'Inter']

const colors = ref({
  primary: '#7B61FF',
  primaryVariant: '#3B2F79',
  primaryLight: '#ece8ff',
  primaryDisabled: '#8d8d8d',
  secondary: '#B5D0D7',
  secondaryVariant: '#2f6f88',
  secondaryDisabled: '#8d8d8d',
  background: '#F4F4F4',
  surface: '#FFFFFF',
  error: '#D15353',
  gray: '#dbdbdb',
  black: '#000000',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#262626',
  textOnBg: '#262626',
  textOnSurface: '#262626',
  textOnSurfaceLight: '#4e4e4e',
  textOnError: '#ffffff',
  headerBg: '#ffffff',
  headerText: '#262626',
  footerBg: '#424242',
  footerText: '#ffffff',
})

const cssOutput = ref('')

function generateCss() {
  cssOutput.value = `
    /************************/
    /***** Piveau Fonts *****/
    /************************/
    --font-sans: "${fontFamily.value}", sans-serif;
    --font-display: "${fontFamily.value}", sans-serif;

    /********************************/
    /***** Piveau Border-radius *****/
    /*******************************/
    --border-radius-custom: ${borderRadius.value}px;
    --border-radius-search: 100px;

    /*****************************/
    /* Piveau Background Colors */
    /*****************************/
    --piveau-primary: ${colors.value.primary};
    --piveau-primary-variant: ${colors.value.primaryVariant};
    --piveau-primary-light: ${colors.value.primaryLight};
    --piveau-primary-disabled: ${colors.value.primaryDisabled};
    --piveau-secondary: ${colors.value.secondary};
    --piveau-secondary-variant: ${colors.value.secondaryVariant};
    --piveau-secondary-disabled: ${colors.value.secondaryDisabled};
    --piveau-background: ${colors.value.background};
    --piveau-surface: ${colors.value.surface};
    --piveau-error: ${colors.value.error};
    --piveau-gray: ${colors.value.gray};
    --piveau-black: ${colors.value.black};

    /**********************/
    /* Piveau Text colors */
    /**********************/
    --piveau-text-on-primary: ${colors.value.textOnPrimary};
    --piveau-text-on-secondary: ${colors.value.textOnSecondary};
    --piveau-text-on-bg: ${colors.value.textOnBg};
    --piveau-text-on-surface: ${colors.value.textOnSurface};
    --piveau-text-on-surface-light: ${colors.value.textOnSurfaceLight};
    --piveau-text-on-error: ${colors.value.textOnError};

    /*************************/
    /* Header and Footer */
    /*************************/
    --piveau-header-bg: ${colors.value.headerBg};
    --piveau-header-text: ${colors.value.headerText};
    --piveau-footer-bg: ${colors.value.footerBg};
    --piveau-footer-text: ${colors.value.footerText};
    `
}

function updateExample() {
  generateCss()
}

function saveCssConfig() {
  const blob = new Blob([cssOutput.value], { type: 'text/css' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = 'piveau-theme.css'
  link.click()
}

async function copyConfig() {
  try {
    await navigator.clipboard.writeText(cssOutput.value)
    alert(t('themer.copySuccess'))
  }
  catch (err) {
    console.error('Failed to copy: ', err)
  }
}

function resetConfig() {
  fontFamily.value = 'Inter'
  borderRadius.value = '25'
  colors.value = {
    primary: '#7B61FF',
    primaryVariant: '#3B2F79',
    primaryLight: '#ece8ff',
    primaryDisabled: '#8d8d8d',
    secondary: '#B5D0D7',
    secondaryVariant: '#2f6f88',
    secondaryDisabled: '#8d8d8d',
    background: '#F4F4F4',
    surface: '#FFFFFF',
    error: '#D15353',
    gray: '#dbdbdb',
    black: '#000000',
    textOnPrimary: '#ffffff',
    textOnSecondary: '#262626',
    textOnBg: '#262626',
    textOnSurface: '#262626',
    textOnError: '#ffffff',
    headerBg: '#ffffff',
    headerText: '#262626',
    footerBg: '#424242',
    footerText: '#ffffff',
  }
  generateCss()
}

watch(
  [fontFamily, borderRadius, colors],
  () => {
    generateCss()
  },
  { deep: true },
)

generateCss()
</script>

<template>
  <div class="relative container mx-auto mt-10 grid">
    <div class="config mb-20 space-y-6">
      <h1 class="mb-5 text-[1.375rem] font-bold">
        {{ t('themer.title') }}
      </h1>

      <!-- Font Family -->
      <div class="rounded-lg bg-surface p-5">
        <div class="input-group-2">
          <label class="mb-2 block font-medium">{{ $t('themer.font.label') }}</label>
          <select v-model="fontFamily" class="mb-5 w-50 rounded border p-2" @change="updateExample">
            <option v-for="font in fonts" :key="font" :value="font">
              {{ font }}
            </option>
          </select>
          <p :style="{ fontFamily }" class="text-lg">
            {{ $t('themer.piveauSlogan') }}
          </p>
        </div>
      </div>

      <!-- Colors -->
      <div class="mt-10 rounded-lg bg-surface p-5">
        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.primary') }}</label>
          <input
            v-model="colors.primary" type="color" class="h-8 w-12 rounded p-0"
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.primary }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.primaryVariant') }}</label>
          <input
            v-model="colors.primaryVariant" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.primaryVariant }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.primaryLight') }}</label>
          <input
            v-model="colors.primaryLight" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.primaryLight }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.secondary') }}</label>
          <input
            v-model="colors.secondary" type="color" class="h-8 w-12 rounded p-0"
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.secondary }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.error') }}</label>
          <input
            v-model="colors.error" type="color" class="h-8 w-12 rounded p-0"
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.error }}</span>
        </div>

        <hr class="mb-5">

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.background') }}</label>
          <input
            v-model="colors.background" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.background }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.surface') }}</label>
          <input
            v-model="colors.surface" type="color" class="h-8 w-12 rounded p-0"
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.surface }}</span>
        </div>

        <hr class="mb-5">

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.textOnPrimary') }}</label>
          <input
            v-model="colors.textOnPrimary" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.textOnPrimary }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.textOnSecondary') }}</label>
          <input
            v-model="colors.textOnSecondary" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.textOnSecondary }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.textOnBackground') }}</label>
          <input
            v-model="colors.textOnBg" type="color" class="h-8 w-12 rounded p-0"
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.textOnBg }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.textOnSurface') }}</label>
          <input
            v-model="colors.textOnSurface" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.textOnSurface }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.textOnSurfaceLight') }}</label>
          <input
            v-model="colors.textOnSurfaceLight" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.textOnSurfaceLight }}</span>
        </div>

        <hr class="mb-5">

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.headerBackground') }}</label>
          <input
            v-model="colors.headerBg" type="color" class="h-8 w-12 rounded p-0"
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.headerBg }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.headerText') }}</label>
          <input
            v-model="colors.headerText" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.headerText }}</span>
        </div>

        <hr class="mb-5">

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.footerBackground') }}</label>
          <input
            v-model="colors.footerBg" type="color" class="h-8 w-12 rounded p-0"
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.footerBg }}</span>
        </div>

        <div class="input-group">
          <label class="mb-2 block font-medium">{{ $t('themer.colors.footerText') }}</label>
          <input
            v-model="colors.footerText" type="color" class="
              h-8 w-12 rounded p-0
            "
            @input="updateExample"
          >
          <span class="ml-2">{{ colors.footerText }}</span>
        </div>
      </div>

      <!-- Border Radius -->
      <div class="rounded-lg bg-surface p-5">
        <div class="input-group-2">
          <label class="mb-2 block font-medium">{{ $t('themer.borderRadius.label') }}</label>
          <select v-model="borderRadius" class="w-50 rounded border p-2" @change="updateExample">
            <option value="0">
              {{ $t('themer.borderRadius.square') }}
            </option>
            <option value="10">
              {{ $t('themer.borderRadius.middleRound') }}
            </option>
            <option value="25">
              {{ $t('themer.borderRadius.round') }}
            </option>
          </select>
          <button
            :style="{
              borderRadius: `${borderRadius}px`,
              backgroundColor: colors.primary,
              color: colors.textOnPrimary,

            }" class="mt-2 w-50 px-4 py-2 text-white"
          >
            {{ $t('themer.exampleButton') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Code Area -->
    <div class="code-area">
      <h2 class="mb-5 text-[1.375rem] font-bold">
        {{ $t('themer.generatedCss') }}
      </h2>
      <div class="relative">
        <textarea
          v-model="cssOutput" rows="20" cols="50"
          class="font-mono w-full rounded-lg bg-surface p-4 text-sm"
        />
        <button
          class="
            absolute top-2 right-2 rounded bg-gray-200 p-2
            hover:bg-gray-300
          " @click="copyConfig"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
            class="bi bi-copy text-black" viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
            />
          </svg>
        </button>
      </div>
      <button class="mt-4 mr-5 rounded rounded-3xl bg-gray px-4 py-2 text-black" @click="resetConfig">
        {{ $t('themer.resetConfig') }}
      </button>

      <button
        :style="{
          borderRadius: `${borderRadius}px`,
          backgroundColor: colors.primary,
          color: colors.textOnPrimary,
        }" class="mt-2 px-4 py-2 text-white" @click="saveCssConfig"
      >
        {{ $t('themer.saveCssConfig') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.container {
    display: flex;
    gap: 20px;
}

.config {
    width: 50%;
}

.code-area {
    flex: 1;
}

.input-group {
    display: flex;
    gap: 5px;
    /* Fügt gleichmäßigen Abstand zwischen Label und Eingabeelement hinzu */
    margin-bottom: 1rem;
    /* Fügt Abstand zwischen den Gruppen hinzu */
}

.input-group-2 {
    display: flex;
    flex-direction: column;
    /* Richtet die Elemente vertikal aus */
    gap: 5px;
    /* Fügt gleichmäßigen Abstand zwischen den Elementen hinzu */
    margin-bottom: 1rem;
    /* Fügt Abstand zwischen den Gruppen hinzu */
}

.input-group label {
    font-weight: 500;
    /* Optional: Einheitliche Schriftstärke für Labels */
}
</style>
