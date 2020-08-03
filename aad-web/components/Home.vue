<template>
  <div id="home" class="band">
    <section class="section-map">
      <!-- Authenticate v-if="!authorized"/-->
      <!-- MapAdopt v-if="authorized" / -->
      <!-- DrainAdoption v-if="authorized" / -->
      <DrainAdoption />
    </section>
  </div>
</template>

<script>
// import { AWSHandlers } from './mixins/AWSHandlers.js'
import DrainAdoption from '@/components/DrainAdoption.vue'

export default {
  components: {
    DrainAdoption
  },
  data () {
    return {
      submitStatus: 'PENDING',
      page: {
        title: 'Adopt a Drain',
        subtitle: 'Type a word!'
      }
    }
  },
  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    },
    feedBack (msg) {
      this.page.subtitle = msg
    }
  }
}
</script>

<style scoped>
.band {
  width: 100%;
}
</style>
