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
  computed: {
  /*
    awsHandlers () {
      return new AWSHandlers(this)
    },
    awsGuestHeader () {
      return {
        'Content-Type': 'application/json'
      }
    },
    awsGuestBody () {
      return process.env.GUEST
    },
    awsGatewayHeader () {
      return {
        'Content-Type': 'application/json',
        'Authorization': this.session.authorizationToken
      }
    },
    awsGatewayBody () {
      return this.form
    },
    awsGatewayURL () {
      // no keywords
      return process.env.INDEX
    }
    */
  },
  mounted () {
    // at this point we want to make a connection a guest connection to our services
    // connect to aws here awsHandlers
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
