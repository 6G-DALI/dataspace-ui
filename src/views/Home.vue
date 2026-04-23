<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div>
    <!-- ////////////////////// -->
    <!-- Hero Section Prototype -->
    <!-- ////////////////////// -->

    <!-- Idea:
         Put search on the first page with "What is piveau?" as search example.
         On our demo we could have a sample of own datasets with "what is piveea",
         "how to set up piveau", "Gitlab resources of pivea", "latest Docker images", "full Dumentation",
         "what is MQA?", "what is Consus?", "pivea paper" ...

         >> so users can find all resources related to piveau and the data management ecosystem
         >> and we can use the search function to show how it works
     -->

    <!-- Note: This is only a prototype/draft, open for feedback, ideas and further design/decelopment -->
    <section>
      <div>
        <section>
          <div class="relative mx-auto min-h-screen w-full max-w-[var(--breakpoint-xl)] bg-gradient-to-b from-[var(--piveau-primary-light)] to-[var(--piveau-surface)] dark:from-[var(--piveau-background-dark)] dark:to-[var(--piveau-surface)]">
            <div
              class="
            z-10 mx-auto max-w-prose px-4 py-16 text-center
            sm:px-6 sm:py-24
            lg:px-8 lg:py-32
          "
            >
      
              <h1 class="z-10 text-4xl font-bold text-surface-text sm:text-5xl">
                {{ t('home.piveau.title.before') }}
                <span class="text-primary"> {{ t('home.piveau.title.brand') }} </span>
              </h1>

              <p class="mt-5 text-surface-light sm:text-lg/relaxed">
                <strong>{{ t('home.piveau.brand') }}</strong>
                {{ t('home.piveau.description.part1') }}
                <strong>{{ t('home.piveau.description.part2Strong') }}</strong>
                {{ t('home.piveau.description.part3') }}
                <strong>{{ t('home.piveau.description.part4Strong') }}</strong>
              </p>
              <br>

              <div class="z-10 mt-4 flex justify-center gap-4 sm:mt-3">
                <RouterLink
                  class="
                w-m mt-4 flex items-center justify-center gap-2 rounded-3xl
                bg-primary px-5 py-3 text-primary-text transition-colors
                hover:bg-primary-hover hover:text-white
              "
                  to="/datasets"
                >
                  {{ t('home.piveau.actions.exploreDemo') }}
                </RouterLink>

                <a
                  href="https://doc.piveau.eu/general/introduction/"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="
                w-m mt-4 flex items-center justify-center gap-2 rounded-3xl
                bg-gray px-5 py-3 text-gray-700
                hover:bg-primary-hover hover:text-white
              "
                >
                  {{ t('home.piveau.actions.documentation') }}
                  <svg
                    class="size-4 rtl:rotate-180"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>

    <!-- ////////////////////////////////// -->
    <!--        Newsletter Prototype        -->
    <!-- ////////////////////////////////// -->

    <!-- <section class="p-10 pb-18 bg-surface">
      <div class="p-8 md:p-12 lg:px-16 lg:py-24">
        <div class="mx-auto max-w-lg text-center">
          <h2 class="text-2xl font-bold text-surface-text md:text-3xl dark:text-white">
            Join the piveau Community
          </h2>

          <p class="hidden text-surface-light sm:mt-4 sm:block dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quae dolor officia blanditiis
            repellat in, vero, aperiam porro ipsum laboriosam consequuntur exercitationem incidunt
            tempora nisi?
          </p>
        </div>

        <div class="mx-auto mt-8 max-w-xl">
          <form action="#" class="sm:flex sm:gap-4">
            <div class="sm:flex-1">
              <label for="email" class="sr-only">Email</label>

              <input type="email" placeholder="Email address"
                class="w-full text-surface-text bg-surface rounded-3xl border border-gray p-3 transition focus:ring-primary focus:outline-none" />
            </div>

            <button type="submit"
              class="group mt-4 flex w-m items-center justify-center gap-2 rounded-3xl bg-primary px-5 py-3 text-white hover:bg-primary-hover sm:mt-0 sm:w-auto">
              <span class="text-sm font-medium"> Sign Up </span>

              <svg class="size-5 rtl:rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </section> -->
  </div>
</template>

<style scoped>

</style>
