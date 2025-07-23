<script>
import appConfig from '../../../../config/appConfig'
// Import components used in template
import AppLink from './AppLink.vue'
// Import glue-config.js

export default {
  name: 'ResourceDetailsLinkedDataButton',
  components: {
    AppLink,
  },
  props: {
    text: {
      type: String,
      default: '',
    },
    format: {
      type: String,
      default: '',
      required: true,
    },
    resourcesId: {
      type: String,
      default: '',
      required: true,
    },
    resources: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {},
  methods: {
    createLinkedDataURL() {
      if (this.resources === 'distributions') {
        return `${appConfig.piveauHubSearchUrl}distributions/${this.resourcesId}.${this.format}`
      } if (this.resources === 'datasets') {
        return `${appConfig.piveauHubSearchUrl}datasets/${this.resourcesId}.${this.format}?useNormalizedId=true&locale=${this.$route.query.locale}`
      } if (this.resources === 'catalogues') {
        return `${appConfig.piveauHubSearchUrl}catalogues/${this.resourcesId}.${this.format}`
      }
      return ''
    },
  },
}
</script>

<template>
  <AppLink :to="createLinkedDataURL()" target="_blank" is-tooltip="true">
    {{ text }}
  </AppLink>
</template>

<style lang="scss" scoped>
</style>
