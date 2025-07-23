<script setup lang="ts">
import { RouterLink } from 'vue-router'
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
      <div
        class="
          relative mx-auto h-screen w-screen max-w-(--breakpoint-xl) bg-surface
        "
      >
        <div
          class="
            z-10 mx-auto max-w-prose px-4 py-16 text-center
            sm:px-6 sm:py-24
            lg:px-8 lg:py-32
          "
        >
          <h1
            class="
              z-10 text-4xl font-bold text-surface-text
              sm:text-5xl
            "
          >
            Data Catalogues Done Right with
            <span class="text-primary"> piveau </span>
          </h1>

          <p
            class="
              mt-4 text-surface-light
              sm:text-lg/relaxed
            "
          >
            <strong>piveau</strong> is an <strong>open source metadata catalogue solution</strong> that covers
            the essential life cycle of your metadata:
            <strong>harvesting, storage and quality assurance</strong>.
          </p> <br>
          <!-- <ul>
            <li class="list-disc">Designed around <span class="text-primary">Semantic Web technologies</span>, the <span class="text-primary">W3C DCAT standard</span>, and the <span class="text-primary">European DCAT-AP standard</span> for Open Data</li>
            <li class="list-disc">closes the gap between <span class="text-primary">formal metadata specifications</span> and their <span class="text-primary">real-world application</span></li>
          </ul>
            With a strong emphasis on Open Data, piveau is the leading solution for public administrations and non-profit organizations to publish interoperable and flexible metadata catalogues. -->

          <div
            class="
              z-10 mt-4 flex justify-center gap-4
              sm:mt-6
            "
          >
            <RouterLink
              class="
                w-m mt-4 flex items-center justify-center gap-2 rounded-3xl
                bg-primary px-5 py-3 text-primary-text transition-colors
                hover:bg-primary-hover hover:text-white
              "
              to="/datasets"
            >
              Explore Demo
            </RouterLink>
            <a
              href="https://doc.piveau.eu/general/introduction/" target="_blank" rel="noopener noreferrer"
              class="
                w-m mt-4 flex items-center justify-center gap-2 rounded-3xl
                bg-gray px-5 py-3 text-gray-700
                hover:bg-primary-hover hover:text-white
              "
            >
              Documentation
              <svg
                class="
                  size-4
                  rtl:rotate-180
                " xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
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
