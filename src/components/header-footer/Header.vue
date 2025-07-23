<script setup>
import KButton from '@/components/base/button/KButton.vue'
import LanguageSelector from '@/components/language-selector/LanguageSelector.vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import DarkModeToggle from '../toggler-dark-mode/DarkModeToggle.vue'
import NavigationBar from './NavigationBar.vue'

const { t } = useI18n()
const visible = ref(false)
</script>

<template>
  <header class="border-gray-200 bg-primary text-header-bg-text">
    <div
      class="
        mx-auto px-2 py-10
        md:px-10
        lg:container
      "
    >
      <div class="grid grid-cols-3 items-center">
        <!-- Left: Logo -->
        <div class="flex items-center">
          <RouterLink class="block" to="/">
            <img
              src="../../../public/piveau-logo.png" alt="piveau logo" class="
                w-40
              "
            >
          </RouterLink>
        </div>

        <!-- Center: Navigation -->
        <div class="flex justify-center">
          <div
            class="
              hidden
              md:block
            "
          >
            <NavigationBar />
          </div>
        </div>

        <!-- Right: Actions -->
        <div class="flex items-center justify-end gap-4">
          <!-- Mobile Menu Button -->
          <div class="md:hidden">
            <KButton
              variant="null"
              class="text-surface"
              @click="visible = !visible"
            >
              <i class="icon-[ph--list]" />
            </KButton>
          </div>

          <!-- Desktop Actions -->
          <div
            class="
              hidden items-center gap-4
              md:flex
            "
          >
            <LanguageSelector />
            <DarkModeToggle />
            <a
              target="_blank" href="https://doc.piveau.eu/general/introduction/"
              class="ml-4 flex items-center font-light text-surface"
            >
              {{ t('landing-page.header.docs') }}
              <!-- <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-box-arrow-up-right ml-2" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
                <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
              </svg> -->
            </a>
            <a
              target="_blank" href="https://gitlab.com/piveau/"
              class="flex items-center font-light text-surface"
            >
              <img
                src="../../assets/images/icons8-gitlab-48.png" alt="Gitlab" class="
                  mr-1 size-4
                "
              >
              GitLab
            </a>
          </div>
        </div>
      </div>
    </div>

    <div
      class="
        mx-auto px-6 py-8
        md:hidden
      "
      :class="{ hidden: !visible }"
    >
      <NavigationBar
        direction="vertical"
      />
      <div class="mt-8 flex flex-col gap-4 border-t border-neutral-200 pt-8">
        <LanguageSelector />
        <a
          target="_blank"
          href="https://doc.piveau.eu/general/introduction/"
          class="
            text-fg flex items-center font-light
            hover:text-primary-hover
          "
        >
          Docs
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-box-arrow-up-right ml-2" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5" />
              <path fill-rule="evenodd" d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0z" />
            </svg> -->
        </a>
        <a
          target="_blank"
          href="https://gitlab.com/piveau/"
          class="
            text-fg flex items-center font-light
            hover:text-primary-hover
          "
        >
          <img
            src="../../assets/images/icons8-gitlab-48.png" alt="Gitlab" class="
              mr-1 size-4
            "
          >
          GitLab
        </a>
      </div>
    </div>
  </header>
</template>

<style>
.brand {
  margin-left: 20px;
  display: flex;
}
</style>
