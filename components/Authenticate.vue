<template>
  <div class="band">
    <!-- Step 1 Sign In -->
    <div v-if="!isAuthenticated" class="outer-div"> <!-- Sign In-->
      <SignIn />
    </div>
    <!-- Step 2 Sign Out-->
    <div v-else class="outer-div">
      <br/>
      <SignOut />
    </div>
  </div>
</template>
<script>

import Expiration from '@/components/mixins/ExpirationMixin.js'

// import { Constants } from './mixins/Constants.js'
import SignOut from '@/components/SignOut.vue'
import SignIn from '@/components/SignIn.vue'

export default {
  mixins: [Expiration],
  components: {
    SignIn,
    SignOut
  },


  beforeDestroy () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // task: avoid memory leak while polling signin expiration

    clearInterval(this.interval_monitor_expiration)
    this.interval_monitor_expiration=null
    //this.log('beforeDestroy ')
  },
  created () {
    // Objective: Give the user feedback when signin expires
    // Strategy: Use a polling function
    // Task: start the polling function
    //this.log(this.interval_monitor_expiration)
    //this.log('created')

    this.pollExpiration()
    //this.log(this.interval_monitor_expiration)
    //this.log('created')
  },

  methods: {
    log (msg) {
      /* eslint-disable no-console */
      console.log(msg)
      /* eslint-enable no-console */
    }
  } // end of methods

}
</script>

<style scoped>
.band {
  width: 100%;
  height: 400px;
}

</style>
